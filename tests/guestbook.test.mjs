import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createFileStore, createRedisStore, handleGuestbookRequest, validateNote } from "../src/utils/guestbook.mjs";

const input = { name: "Ada", message: "Thanks for sharing your work!", color: "sage" };
const request = (body = input, origin = "https://yemii.vercel.app") => new Request("https://yemii.vercel.app/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json", Origin: origin, "x-forwarded-for": "192.0.2.1" }, body: JSON.stringify(body) });
const get = () => new Request("https://yemii.vercel.app/api/guestbook");
async function withStore(fn) {
  const dir = await mkdtemp(path.join(tmpdir(), "portfolio-guestbook-test-"));
  try { await fn(createFileStore(path.join(dir, "notes.json")), dir); }
  finally { await rm(dir, { recursive: true, force: true }); }
}

test("submitted notes publish immediately, persist and can be removed by the owner", () => withStore(async (store, dir) => {
  const response = await handleGuestbookRequest(request(), store);
  assert.equal(response.status, 201);
  const result = await response.json();
  assert.equal(result.status, "published");
  assert.equal(result.note.message, input.message);
  const visible = await (await handleGuestbookRequest(get(), store)).json();
  assert.equal(visible.notes[0].id, result.note.id);
  assert.equal((await store.list("pending")).length, 0);
  const reopened = createFileStore(path.join(dir, "notes.json"));
  assert.equal((await reopened.list("published")).length, 1);
  assert.equal(await store.moderate(result.note.id, "reject"), true);
  assert.equal((await store.list("published")).length, 0);
}));

test("same visitor cannot send repeated notes inside the cooldown", () => withStore(async store => {
  assert.equal((await handleGuestbookRequest(request(), store)).status, 201);
  const limited = await handleGuestbookRequest(request(), store);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "60");
  assert.equal((await store.list("published")).length, 1);
}));
test("cross-site writes, missing origins, spam fields and malformed bodies are denied", () => withStore(async store => {
  assert.equal((await handleGuestbookRequest(request(input, "https://attacker.example"), store)).status, 403);
  assert.equal((await handleGuestbookRequest(request(input, ""), store)).status, 403);
  assert.equal((await handleGuestbookRequest(request({ ...input, website: "spam" }), store)).status, 400);
  assert.equal((await handleGuestbookRequest(request(null), store)).status, 400);
  assert.equal((await handleGuestbookRequest(request({ ...input, message: "x".repeat(5000) }), store)).status, 413);
  assert.deepEqual(await store.list("pending"), []);
}));
test("validation rejects links, private email addresses, oversized text and unknown colors", () => {
  for (const changed of [{ name: "" }, { name: "a".repeat(41) }, { message: "x" }, { message: "https://spam.example" }, { message: "mail me at person@example.com" }, { color: "url(evil)" }]) assert.throws(() => validateNote({ ...input, ...changed }));
  assert.equal(validateNote({ ...input, name: "  Ada   Lovelace  " }).name, "Ada Lovelace");
});
test("absent production storage fails closed without claiming to save notes", async () => {
  const response = await handleGuestbookRequest(request(), null);
  assert.equal(response.status, 503);
  assert.deepEqual(await (await handleGuestbookRequest(get(), null)).json(), { notes: [], canSubmit: false });
});
test("storage failures return safe errors and method restrictions remain explicit", async () => {
  const store = { list: async () => { throw new Error("private storage details"); }, add: async () => { throw new Error("secret"); } };
  const response = await handleGuestbookRequest(get(), store);
  assert.equal(response.status, 503);
  assert.ok(!(await response.text()).includes("private storage details"));
  const post = await handleGuestbookRequest(request(), store);
  assert.equal(post.status, 503);
  assert.ok(!(await post.text()).includes("secret"));
  const denied = await handleGuestbookRequest(new Request("https://yemii.vercel.app/api/guestbook", { method: "DELETE" }), store);
  assert.equal(denied.status, 405);
  assert.equal(denied.headers.get("allow"), "GET, POST");
});

test("Redis submissions target the published list with atomic cooldown and retention", async t => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    calls.push(JSON.parse(options.body));
    return Response.json({ result: "saved" });
  });
  const store = createRedisStore("https://storage.example", "test-token");
  assert.equal(await store.add({ ...input, id: "test-note" }, "visitor"), "saved");
  const [command] = calls;
  assert.equal(command[0], "EVAL");
  assert.equal(command[3], "portfolio:guestbook:published");
  assert.match(command[1], /NX.*EX.*60/);
  assert.match(command[1], /LTRIM/);
});
