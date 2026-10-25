import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createFileStore, handleGuestbookRequest, validateNote } from "../src/utils/guestbook.mjs";

const input = { name: "Ada", message: "Thanks for sharing your work!", color: "sage" };
const request = (body = input, origin = "https://yemii.vercel.app") => new Request("https://yemii.vercel.app/api/guestbook", { method: "POST", headers: { "Content-Type": "application/json", Origin: origin, "x-forwarded-for": "192.0.2.1" }, body: JSON.stringify(body) });
const get = () => new Request("https://yemii.vercel.app/api/guestbook");
async function withStore(fn) {
  const dir = await mkdtemp(path.join(tmpdir(), "portfolio-guestbook-test-"));
  try { await fn(createFileStore(path.join(dir, "notes.json")), dir); }
  finally { await rm(dir, { recursive: true, force: true }); }
}

test("submitted notes stay private until owner approval, persist, and can be rejected", () => withStore(async (store, dir) => {
  assert.equal((await handleGuestbookRequest(request(), store)).status, 202);
  assert.deepEqual((await (await handleGuestbookRequest(get(), store)).json()).notes, []);
  const [note] = await store.list("pending");
  assert.equal(note.name, input.name);
  const reopened = createFileStore(path.join(dir, "notes.json"));
  assert.equal((await reopened.list("pending")).length, 1);
  assert.equal(await store.moderate(note.id, "approve"), true);
  const visible = await (await handleGuestbookRequest(get(), store)).json();
  assert.equal(visible.notes[0].message, input.message);
  assert.equal((await store.list("pending")).length, 0);
  assert.equal(await store.moderate(note.id, "approve"), false);
  await store.add({ ...input, id: "reject-me", createdAt: new Date().toISOString() }, "another-visitor");
  assert.equal(await store.moderate("reject-me", "reject"), true);
  assert.equal((await store.list("pending")).length, 0);
  assert.equal((await store.list("published")).length, 1);
}));
test("same visitor cannot send repeated notes inside the cooldown", () => withStore(async store => {
  assert.equal((await handleGuestbookRequest(request(), store)).status, 202);
  const limited = await handleGuestbookRequest(request(), store);
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "60");
  assert.equal((await store.list("pending")).length, 1);
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
