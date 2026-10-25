// Run only from a trusted owner terminal. No moderation endpoint is exposed publicly.
import { getGuestbookStore } from "../src/utils/guestbook.mjs";
const [action, id] = process.argv.slice(2);
if (!["list", "approve", "reject"].includes(action) || (action !== "list" && !id)) throw new Error("Use: node --env-file-if-exists=.env.local scripts/moderate-guestbook.mjs list|approve <id>|reject <id>");
const store = getGuestbookStore();
if (!store) throw new Error("Configure the guestbook Redis URL and token before moderating production notes.");
if (action === "list") console.log(JSON.stringify(await store.list("pending"), null, 2));
else {
  const found = await store.moderate(id, action);
  if (!found) { console.error("No pending note with that ID."); process.exitCode = 1; }
  else console.log(action === "approve" ? "Note published." : "Note rejected and deleted.");
}
