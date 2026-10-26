import { setTimeout as delay } from "node:timers/promises";
import { SITE } from "../discoverability/site.js";

// The recipient is owner-controlled, never supplied by a public request.
const RECIPIENT = "adegboyeopeyemi065@gmail.com";

export async function notifyGuestbookOwner(note, {
  env = process.env, fetchImpl = fetch, wait = delay,
  log = message => console.warn(message),
} = {}) {
  if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL) {
    // Missing setup must not turn a successfully stored note into a failed submission.
    log("[guestbook] Email notifications are not configured.");
    return { status: "unconfigured" };
  }
  const body = JSON.stringify({
    sender: { email: env.BREVO_SENDER_EMAIL, name: env.BREVO_SENDER_NAME || "Yemi’s portfolio" },
    to: [{ email: RECIPIENT }],
    headers: { idempotencyKey: note.id },
    subject: "New note in your portfolio guestbook",
    // Plain text avoids rendering user-authored markup. Do not include IPs or avatars.
    textContent: `A new note was published.\n\nFrom: ${note.name}\nDate: ${note.createdAt}\n\n${note.message}\n\nView your guestbook: ${SITE.origin}/guestbook`,
  });
  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (attempt) await wait(350 * 2 ** (attempt - 1));
    try {
      const response = await fetchImpl("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": env.BREVO_API_KEY,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body,
        signal: AbortSignal.timeout(2500),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.messageId) return { status: "accepted" };
      if (response.status === 400 && result.code === "duplicate_parameter") return { status: "duplicate" };
      if (response.status !== 429 && response.status < 500) break;
    } catch { /* Retry transient transport failures with the same idempotency key. */ }
  }
  // Never log credentials, response bodies, visitor content or addresses.
  log("[guestbook] Email notification failed after saving the note.");
  return { status: "failed" };
}
