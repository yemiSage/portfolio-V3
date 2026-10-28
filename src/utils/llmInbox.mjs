import { createHash, timingSafeEqual, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";

const KEY = "portfolio:llm:inbox";
const MAX_ENTRIES = 500;
const RETENTION_MS = 90 * 86400000;
const MIN_KEY_LENGTH = 12;
const recent = entries => entries.filter(entry => Date.parse(entry.createdAt) > Date.now() - RETENTION_MS).slice(0, MAX_ENTRIES);

export function createInboxFileStore(file) {
  let pending = Promise.resolve();
  const list = async () => {
    try { return recent(JSON.parse(await readFile(file, "utf8"))); }
    catch (error) { if (error.code === "ENOENT") return []; throw error; }
  };
  return {
    list,
    add(entry) {
      const operation = pending.then(async () => {
        const entries = recent([entry, ...await list()]);
        await mkdir(path.dirname(file), { recursive: true });
        const temporary = `${file}.${randomUUID()}.tmp`;
        await writeFile(temporary, JSON.stringify(entries), { mode: 0o600 });
        await rename(temporary, file);
      });
      pending = operation.catch(() => {});
      return operation;
    },
  };
}

export function createInboxRedisStore(url, token) {
  const command = async args => {
    const response = await fetch(url, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args), signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error("Inbox storage unavailable");
    const data = await response.json();
    if (data.error) throw new Error("Inbox storage command failed");
    return data.result;
  };
  return {
    list: async () => recent((await command(["LRANGE", KEY, 0, MAX_ENTRIES - 1])).map(value => JSON.parse(value))),
    add: entry => command(["EVAL", "redis.call('LPUSH',KEYS[1],ARGV[1]); redis.call('LTRIM',KEYS[1],0,499); redis.call('EXPIRE',KEYS[1],7776000); return 1", 1, KEY, JSON.stringify(entry)]),
  };
}

let localStore;
export function getInboxStore() {
  // Do not collect conversations until the owner has enabled the private inbox.
  if (!process.env.LLM_INBOX_KEY || process.env.LLM_INBOX_KEY.length < MIN_KEY_LENGTH) return null;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) {
    if (!url.startsWith("https://")) throw new Error("Inbox storage requires HTTPS");
    return createInboxRedisStore(url, token);
  }
  if (process.env.VERCEL || process.env.NODE_ENV === "production") return null;
  return localStore ||= createInboxFileStore(path.join(process.cwd(), ".data", "llm-inbox.json"));
}

export async function recordConversation({ question, answer, page, source, status }) {
  try {
    const store = getInboxStore();
    if (!store) return;
    // Store only this exchange. No IP address, browser identity, or page contents.
    await store.add({ id: randomUUID(), createdAt: new Date().toISOString(),
      question: String(question || "").slice(0, 1000), answer: String(answer || "").slice(0, 16000),
      page: typeof page === "string" ? page.split(/[?#]/)[0].slice(0, 300) : "/",
      source: String(source || "unknown").slice(0, 200), status });
  } catch { console.warn("[yemiLLM] Could not save conversation to the private inbox."); }
}

const loginAttempts = new Map();
export async function isInboxLoginLimited(request, authenticated) {
  const identity = createHash("sha256").update((request.headers.get("x-forwarded-for") || "local").split(",")[0].trim()).digest("hex");
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) {
    if (!url.startsWith("https://")) throw new Error("HTTPS required");
    const script = "local n=tonumber(redis.call('GET',KEYS[1]) or '0'); if n>=10 then return 1 end; if ARGV[1]=='0' then redis.call('INCR',KEYS[1]); redis.call('EXPIRE',KEYS[1],900) end; return 0";
    const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(["EVAL", script, 1, `portfolio:llm:login:${identity}`, authenticated ? "1" : "0"]), signal: AbortSignal.timeout(4000) });
    if (!response.ok) throw new Error("Login limiter unavailable");
    const result = await response.json();
    if (result.error) throw new Error("Login limiter unavailable");
    return result.result === 1;
  }
  const now = Date.now();
  for (const [id, attempt] of loginAttempts) if (attempt.expires <= now) loginAttempts.delete(id);
  if (loginAttempts.size >= 5000 && !loginAttempts.has(identity)) return true;
  const attempt = loginAttempts.get(identity) || { count: 0, expires: now + 900000 };
  if (attempt.count >= 10) return true;
  if (!authenticated) { attempt.count++; loginAttempts.set(identity, attempt); }
  return false;
}

export async function handleInboxRequest(request, { key = process.env.LLM_INBOX_KEY, storeFactory = getInboxStore, loginLimited = isInboxLoginLimited } = {}) {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };
  const respond = (body, status = 200) => Response.json(body, { status, headers });
  if (request.method !== "GET") return respond({ error: "Method not allowed" }, 405);
  if (!key || key.length < MIN_KEY_LENGTH) return respond({ error: "Set LLM_INBOX_KEY to an access key of at least 12 characters on the server." }, 503);
  const provided = (request.headers.get("authorization") || "").replace(/^Bearer /, "");
  const digest = value => createHash("sha256").update(value).digest();
  const authenticated = timingSafeEqual(digest(provided), digest(key));
  try {
    if (await loginLimited(request, authenticated)) {
      headers["Retry-After"] = "900";
      return respond({ error: "Too many login attempts. Please wait 15 minutes and try again." }, 429);
    }
  } catch { return respond({ error: "Login is temporarily unavailable. Please try again shortly." }, 503); }
  if (!authenticated) return respond({ error: "Enter the owner access key to view conversations." }, 401);
  try {
    const store = storeFactory();
    if (!store) return respond({ error: "Configure Redis storage in Vercel to save and view conversations." }, 503);
    return respond({ entries: await store.list() });
  } catch { return respond({ error: "Conversation storage is temporarily unavailable." }, 503); }
}
