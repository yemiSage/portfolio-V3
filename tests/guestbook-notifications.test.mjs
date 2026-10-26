import assert from "node:assert/strict";
import test from "node:test";
import { notifyGuestbookOwner } from "../src/utils/guestbookNotifications.mjs";
import { handleGuestbookRequest } from "../src/utils/guestbook.mjs";

const note = { id: "79e557d0-1379-4c03-b826-81b704978faa", name: "Ada", message: "<b>Lovely work</b>", createdAt: "2026-10-26T12:00:00Z", avatar: "private-avatar" };
const env = { BREVO_API_KEY: "test-key", BREVO_SENDER_EMAIL: "notes@example.com" };

test("Brevo duplicate detection stops retries without sending another email", async () => {
  let calls = 0;
  const result = await notifyGuestbookOwner(note, { env, fetchImpl: async () => {
    calls++;
    return Response.json({ code: "duplicate_parameter" }, { status: 400 });
  } });
  assert.equal(result.status, "duplicate");
  assert.equal(calls, 1);
});

test("notifications use the fixed owner address, plain text and a stable retry key", async () => {
  const calls = [];
  const result = await notifyGuestbookOwner(note, { env, fetchImpl: async (url, options) => {
    calls.push({ url, ...options });
    return calls.length === 1 ? new Response(null, { status: 503 }) : Response.json({ messageId: "<mail-id@brevo.com>" });
  } });
  assert.equal(result.status, "accepted");
  assert.equal(calls.length, 2);
  const payload = JSON.parse(calls[0].body);
  assert.deepEqual(payload.to, [{ email: "adegboyeopeyemi065@gmail.com" }]);
  assert.equal(payload.sender.email, env.BREVO_SENDER_EMAIL);
  assert.equal(calls[0].headers["api-key"], env.BREVO_API_KEY);
  assert.ok(payload.textContent.includes(note.message));
  assert.ok(!payload.htmlContent);
  assert.ok(!calls[0].body.includes(note.avatar));
  assert.equal(payload.headers.idempotencyKey, note.id);
  assert.equal(calls[0].body, calls[1].body);
  assert.equal(calls[0].url, "https://api.brevo.com/v3/smtp/email");
});

test("missing credentials skip delivery and permanent failures do not retry or leak provider data", async () => {
  let count = 0;
  const logs = [];
  const fetchImpl = async () => { count++; return new Response("sensitive provider detail", { status: 401 }); };
  assert.equal((await notifyGuestbookOwner(note, { env: {}, fetchImpl, log: m => logs.push(m) })).status, "unconfigured");
  assert.equal(count, 0);
  assert.equal((await notifyGuestbookOwner(note, { env, fetchImpl, log: m => logs.push(m) })).status, "failed");
  assert.equal(count, 1);
  assert.ok(!logs.join().includes("sensitive"));
  assert.ok(!logs.join().includes(env.BREVO_API_KEY));
});

test("notifications run only after successful storage; email failure preserves the published note", async () => {
  const request = () => new Request("https://yemii.vercel.app/api/guestbook", {
    method: "POST", headers: { origin: "https://yemii.vercel.app", "content-type": "application/json" },
    body: JSON.stringify({ name: "Ada", message: "Hello!", color: "sage" }),
  });
  let saved = false, notifications = 0;
  const notify = async () => { assert.equal(saved, true); notifications++; return { status: "failed" }; };
  const result = await handleGuestbookRequest(request(), { add: async () => { saved = true; return "saved"; } }, notify);
  assert.equal(result.status, 201);
  assert.equal(notifications, 1);
  assert.equal((await handleGuestbookRequest(request(), { add: async () => "limited" }, notify)).status, 429);
  assert.equal(notifications, 1);
});
