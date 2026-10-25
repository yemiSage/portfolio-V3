import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { SITE } from "../discoverability/site.js";

const COLORS = new Set(["peach", "lavender", "sage", "butter", "paper"]);
const MAX_PENDING = 500;
export function validateNote(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Please enter your name and a short note.");
  const clean = value => typeof value === "string" ? value.normalize("NFKC").replace(/[\u0000-\u0008\u000b-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, "").trim() : "";
  const name = clean(input.name).replace(/\s+/g, " ");
  const message = clean(input.message);
  if (!name || name.length > 40 || message.length < 2 || message.length > 180) throw new Error("Use a name up to 40 characters and a note between 2 and 180 characters.");
  if (/(?:https?:\/\/|www\.|[\w.+-]+@[\w.-]+\.[a-z]{2,})/i.test(`${name} ${message}`)) throw new Error("Please leave links and email addresses out of your note.");
  if (!COLORS.has(input.color)) throw new Error("Please choose one of the paper colors.");
  return { name, message, color: input.color };
}

export function createFileStore(file) {
  let pending = Promise.resolve();
  const read = async () => { try { return JSON.parse(await readFile(file, "utf8")); } catch (e) { if (e.code === "ENOENT") return { notes: [], limits: {} }; throw e; } };
  const mutate = action => {
    const operation = pending.then(async () => {
      const data = await read();
      const result = action(data);
      await mkdir(path.dirname(file), { recursive: true });
      const temporary = `${file}.${randomUUID()}.tmp`;
      await writeFile(temporary, JSON.stringify(data), { mode: 0o600 });
      await rename(temporary, file);
      return result;
    });
    pending = operation.catch(() => {});
    return operation;
  };
  return {
    list: async status => (await read()).notes.filter(note => note.status === status).slice(-100).reverse(),
    add: (note, identity) => mutate(data => {
      const now = Date.now();
      data.limits = Object.fromEntries(Object.entries(data.limits).filter(([,expiry]) => expiry > now));
      if (data.limits[identity]) return "limited";
      data.limits[identity] = now + 60000;
      data.notes.push({ ...note, status: "published" });
      const published = data.notes.filter(n => n.status === "published").slice(-100);
      data.notes = [...data.notes.filter(n => n.status !== "published"), ...published];
      return "saved";
    }),
    moderate: (id, decision) => mutate(data => {
      const note = data.notes.find(n => n.id === id && (n.status === "pending" || decision === "reject"));
      if (!note) return false;
      if (decision === "approve") note.status = "published";
      else data.notes = data.notes.filter(n => n.id !== id);
      return true;
    }),
  };
}

export function createRedisStore(url, token) {
  const command = async args => {
    const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(args), signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Guestbook storage unavailable");
    const data = await response.json();
    if (data.error) throw new Error("Guestbook storage command failed");
    return data.result;
  };
  const pending = "portfolio:guestbook:pending";
  const published = "portfolio:guestbook:published";
  return {
    list: async status => (await command(["LRANGE", status === "published" ? published : pending, 0, status === "published" ? 99 : MAX_PENDING - 1])).map(value => JSON.parse(value)),
    add: async (note, identity) => {
      const script = `if not redis.call('SET',KEYS[2],'1','NX','EX',60) then return 'limited' end
redis.call('LPUSH',KEYS[1],ARGV[1]) redis.call('LTRIM',KEYS[1],0,99) return 'saved'`;
      return command(["EVAL", script, 2, published, `portfolio:guestbook:limit:${identity}`, JSON.stringify(note)]);
    },
    moderate: async (id, decision) => {
      const script = `local entries = redis.call('LRANGE',KEYS[1],0,-1)
for _,value in ipairs(entries) do
 local note = cjson.decode(value)
 if note.id == ARGV[1] then
  redis.call('LREM',KEYS[1],1,value)
  if ARGV[2] == 'approve' then redis.call('LPUSH',KEYS[2],value) redis.call('LTRIM',KEYS[2],0,99) end
  return 1
 end
end
return 0`;
      return Boolean(await command(["EVAL", script, 2, pending, published, id, decision]));
    },
  };
}

let defaultStore;
export function getGuestbookStore() {
  if (defaultStore) return defaultStore;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    if (!url.startsWith("https://")) throw new Error("Guestbook storage requires HTTPS");
    return defaultStore = createRedisStore(url, token);
  }
  // Serverless files are ephemeral. Fail closed instead of pretending notes were saved.
  if (process.env.VERCEL || process.env.NODE_ENV === "production") return null;
  return defaultStore = createFileStore(path.join(process.cwd(), ".data", "guestbook.json"));
}

function allowedOrigin(origin) {
  if (!origin) return false;
  if (origin === SITE.origin || (process.env.VERCEL_URL && origin === `https://${process.env.VERCEL_URL}`)) return true;
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    try { const url = new URL(origin); return ["localhost", "127.0.0.1"].includes(url.hostname) && url.protocol === "http:"; } catch { return false; }
  }
  return false;
}
const json = (body, status = 200, extra = {}) => Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", ...extra } });
export async function handleGuestbookRequest(request, store = getGuestbookStore()) {
  if (request.method === "GET") {
    try { return json({ notes: store ? await store.list("published") : [], canSubmit: Boolean(store) }); }
    catch { return json({ error: "The guestbook could not load. Please try again shortly." }, 503); }
  }
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, { Allow: "GET, POST" });
  if (!allowedOrigin(request.headers.get("origin"))) return json({ error: "Please send your note from Yemi’s portfolio." }, 403);
  if (!store) return json({ error: "The book isn’t accepting notes just yet. Please say hello by email." }, 503);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Expected a JSON note." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 4096) return json({ error: "That note is too large." }, 413);
  let input;
  try {
    const text = await request.text();
    if (Buffer.byteLength(text) > 4096) return json({ error: "That note is too large." }, 413);
    input = JSON.parse(text);
  } catch { return json({ error: "Please enter a valid note." }, 400); }
  if (input?.website) return json({ error: "That note could not be accepted." }, 400);
  let content;
  try { content = validateNote(input); } catch (e) { return json({ error: e.message }, 400); }
  const client = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const identity = createHash("sha256").update(`${process.env.UPSTASH_REDIS_REST_TOKEN || "local"}:${client}`).digest("hex");
  try {
    const note = { ...content, id: randomUUID(), createdAt: new Date().toISOString() };
    const result = await store.add(note, identity);
    if (result === "limited") return json({ error: "One note at a time. Please wait a minute before sending another." }, 429, { "Retry-After": "60" });
    if (result === "full") return json({ error: "The book is taking a little break. Please try again later." }, 503);
    return json({ status: "published", note }, 201);
  } catch { return json({ error: "Your note could not be saved. Please try again." }, 503); }
}
