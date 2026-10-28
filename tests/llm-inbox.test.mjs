import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createInboxFileStore, handleInboxRequest, recordConversation, isInboxLoginLimited } from "../src/utils/llmInbox.mjs";

const key = "test-owner-key-abcdefghijklmnopqrstuvwxyz";
const request = token => new Request("https://example.com/api/llm-inbox", { headers: token ? { Authorization: `Bearer ${token}` } : {} });

test("inbox rejects unauthorized reads before touching storage and never caches responses", async () => {
  let accessed = false;
  for (const token of [undefined, "wrong-key"]) {
    const response = await handleInboxRequest(request(token), { key, storeFactory: () => { accessed = true; } });
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.match(response.headers.get("X-Robots-Tag"), /noindex/);
    assert.ok(!(await response.text()).includes(key));
  }
  assert.equal(accessed, false);
});

test("owner can read entries; missing configuration and storage failures fail closed", async () => {
  const entries = [{ question: "What does Yemi do?", answer: "Design engineering." }];
  const response = await handleInboxRequest(request(key), { key, storeFactory: () => ({ list: async () => entries }) });
  assert.deepEqual(await response.json(), { entries });
  for (const options of [{ key: "" }, { key, storeFactory: () => null }, { key, storeFactory: () => { throw new Error("secret connection string"); } }]) {
    const unavailable = await handleInboxRequest(request(key), options);
    assert.equal(unavailable.status, 503);
    assert.ok(!(await unavailable.text()).includes("secret connection string"));
  }
});

test("file storage persists concurrent exchanges, bounds capacity, and excludes expired entries", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "llm-inbox-"));
  try {
    const file = path.join(directory, "inbox.json");
    const store = createInboxFileStore(file);
    await writeFile(file, JSON.stringify([{ id: "old", createdAt: "2020-01-01T00:00:00Z" }, ...Array.from({ length: 500 }, (_, index) => ({ id: 499 - index, createdAt: new Date().toISOString() }))]));
    await Promise.all(Array.from({ length: 5 }, (_, index) => store.add({ id: 500 + index, question: "<script>alert(1)</script>", createdAt: new Date().toISOString() })));
    const entries = await createInboxFileStore(file).list();
    assert.equal(entries.length, 500);
    assert.equal(entries[0].id, 504);
    assert.equal(entries.at(-1).id, 5);
    assert.equal(entries[0].question, "<script>alert(1)</script>");
    assert.equal(JSON.parse(await readFile(file, "utf8")).length, 500);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test("disabled collection does not persist or disrupt chat", async () => {
  const previous = process.env.LLM_INBOX_KEY;
  delete process.env.LLM_INBOX_KEY;
  try { await assert.doesNotReject(recordConversation({ question: "Test", answer: "Test" })); }
  finally { if (previous !== undefined) process.env.LLM_INBOX_KEY = previous; }
});

test("surname-length password is supported and repeated failed logins are blocked", async () => {
  const password = "example12345";
  const response = await handleInboxRequest(request(password), { key: password, storeFactory: () => ({ list: async () => [] }), loginLimited: async () => false });
  assert.equal(response.status, 200);
  const attempt = new Request("https://example.com/api/llm-inbox", { headers: { "x-forwarded-for": "192.0.2.200" } });
  for (let i = 0; i < 10; i++) assert.equal(await isInboxLoginLimited(attempt, false), false);
  assert.equal(await isInboxLoginLimited(attempt, false), true);
  assert.equal(await isInboxLoginLimited(attempt, true), true);
  const locked = await handleInboxRequest(request(password), { key: password, loginLimited: async () => true });
  assert.equal(locked.status, 429);
  assert.equal(locked.headers.get("Retry-After"), "900");
});
