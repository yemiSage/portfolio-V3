// Shared yemiLLM chat logic used by the Express dev server (server.ts)
// and the Vercel serverless function (api/chat.ts), so both behave the same.
import { GoogleGenAI } from "@google/genai";
import { YEMI_SYSTEM_INSTRUCTION, cleanChatOutput, getSmartPortfolioReply } from "./chatKnowledge.js";
import { retrieveRelevantContext } from "./ragServer.js";

// Tried in order. Override with a comma-separated GEMINI_MODELS env var.
const DEFAULT_MODELS = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-flash-latest"];
// How long to wait for a model to start answering before trying the next one.
const FIRST_CHUNK_TIMEOUT_MS = 15000;
// How long a started answer may pause between chunks before we stop it.
const CHUNK_IDLE_TIMEOUT_MS = 20000;
const MAX_HISTORY_MESSAGES = 20;
const MAX_PAGE_CONTEXT_CHARS = 15000;

type Content = { role: "user" | "model"; parts: Array<{ text: string }> };

export interface ChatRequestBody {
  message?: unknown;
  history?: unknown;
  context?: { currentPath?: string; pageTitle?: string; extractedText?: string } | null;
  stream?: boolean;
}

function getModels(): string[] {
  const fromEnv = (process.env.GEMINI_MODELS || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_MODELS;
}

let aiClient: GoogleGenAI | null = null;
function getClient(apiKey: string): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return aiClient;
}

// Turns the client's history plus the new message into alternating user/model turns.
// The client's history already ends with the new message, so it is not added twice.
export function buildContents(message: string, history: unknown): Content[] {
  const turns: Content[] = [];
  const items = Array.isArray(history) ? history.slice(-MAX_HISTORY_MESSAGES) : [];

  for (const item of items as any[]) {
    if (!item || !["user", "assistant", "model"].includes(item.role)) continue;
    const text = String(item.content || item.text || "").trim();
    if (!text) continue;
    const role = item.role === "user" ? "user" : "model";
    const last = turns[turns.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n\n${text}`;
    } else {
      turns.push({ role, parts: [{ text }] });
    }
  }

  // Drop the trailing user turn if it is the message being sent now.
  const last = turns[turns.length - 1];
  if (last && last.role === "user" && last.parts[0].text.trim() === message.trim()) {
    turns.pop();
  }
  // Gemini expects the conversation to start with a user turn (the chat opens with a greeting).
  while (turns.length && turns[0].role === "model") turns.shift();

  const tail = turns[turns.length - 1];
  if (tail && tail.role === "user") {
    tail.parts[0].text += `\n\n${message}`;
  } else {
    turns.push({ role: "user", parts: [{ text: message }] });
  }
  return turns;
}

export function buildSystemInstruction(message: string, context: ChatRequestBody["context"]): string {
  let instruction = YEMI_SYSTEM_INSTRUCTION;

  const ragContext = retrieveRelevantContext(message);
  if (ragContext) {
    instruction += `\n\n[RAG SYSTEM PORTFOLIO KNOWLEDGE BASE]\nThe following is highly accurate, extracted context from Opeyemi's official project and page markdown documents. Use it to answer any specific or implicit questions about his portfolio projects, key metrics, client results, background, skills, contact channels, or work philosophy with deep, context-rich intelligence:\n"""\n${ragContext}\n"""`;
  }

  if (context && typeof context === "object") {
    const pageText = String(context.extractedText || "").slice(0, MAX_PAGE_CONTEXT_CHARS);
    instruction += `\n\n[USER SCREEN CONTEXT]\nThe user is currently browsing the page: "${context.currentPath || "/"}".\nPage Title: "${context.pageTitle || ""}".\nHere is the visible content on this page:\n"""\n${pageText}\n"""\nYou are fully aware of everything on this page. When the user asks "what is this page about?", "who is this?", or questions about any text, details, metrics, case studies, sections, or bullet points on this screen, use the visible text above to answer accurately and intelligently as if you are looking at their screen!`;
  }

  return instruction;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

// Yields the reply as it is generated. Falls back to the built-in portfolio
// answers only if no model manages to start a reply.
export async function* streamChatReply(
  body: ChatRequestBody,
  client?: Pick<GoogleGenAI, "models">,
  meta: { source?: string } = {}
): AsyncGenerator<string> {
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const apiKey = process.env.GEMINI_API_KEY;

  if (!client && !apiKey) {
    console.warn("[yemiLLM] GEMINI_API_KEY is not set; using built-in answers.");
    meta.source = "fallback: no API key";
    yield getSmartPortfolioReply(message);
    return;
  }

  const ai = client || getClient(apiKey as string);
  const contents = buildContents(message, body.history);
  const systemInstruction = buildSystemInstruction(message, body.context);

  for (const model of getModels()) {
    let started = false;
    try {
      const stream = await withTimeout(
        ai.models.generateContentStream({ model, contents, config: { systemInstruction, temperature: 0.8 } }),
        FIRST_CHUNK_TIMEOUT_MS,
        model
      );
      const iterator = stream[Symbol.asyncIterator]();
      while (true) {
        const next = await withTimeout(iterator.next(), started ? CHUNK_IDLE_TIMEOUT_MS : FIRST_CHUNK_TIMEOUT_MS, model);
        if (next.done) break;
        const text = next.value?.text;
        if (text) {
          if (!started) meta.source = `model: ${model}`;
          started = true;
          yield text;
        }
      }
      if (started) return;
      console.warn(`[yemiLLM] ${model} returned an empty reply.`);
    } catch (err: any) {
      if (started) {
        console.warn(`[yemiLLM] ${model} stopped mid-reply:`, err?.message || err);
        return;
      }
      console.warn(`[yemiLLM] ${model} failed:`, err?.message || err);
    }
  }

  console.warn("[yemiLLM] All models failed; using built-in answers.");
  meta.source = "fallback: all models failed";
  yield getSmartPortfolioReply(message);
}

// Starts the reply and waits for its first chunk, so we know (and can report) whether
// it came from a model or from the built-in answers before any headers are sent.
async function startReply(body: ChatRequestBody) {
  const meta: { source?: string } = {};
  const replies = streamChatReply(body, undefined, meta);
  const first = await replies.next();
  const chunks = (async function* () {
    if (!first.done && first.value) yield first.value;
    yield* replies;
  })();
  return { chunks, source: meta.source || "unknown" };
}

function isValidBody(body: ChatRequestBody): boolean {
  return typeof body.message === "string" && body.message.trim().length > 0;
}

// Express (server.ts): Node-style req/res.
export async function handleChatRequest(req: any, res: any) {
  const body: ChatRequestBody = req.body || {};
  if (!isValidBody(body)) {
    res.status(400).json({ error: "Message is required." });
    return;
  }

  const { chunks, source } = await startReply(body);
  res.setHeader("X-YemiLLM-Source", source);

  if (!body.stream) {
    let reply = "";
    for await (const chunk of chunks) reply += chunk;
    res.status(200).json({ reply: cleanChatOutput(reply) });
    return;
  }

  res.status(200);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
  try {
    for await (const chunk of chunks) res.write(chunk);
  } catch (err: any) {
    console.error("[yemiLLM] Stream error:", err?.message || err);
  }
  res.end();
}

// Vercel (api/chat.ts): web-standard Request/Response, which Vercel streams to the browser.
export async function handleChatWebRequest(request: Request, extraHeaders: Record<string, string> = {}): Promise<Response> {
  let body: ChatRequestBody = {};
  try {
    body = await request.json();
  } catch {
    // fall through to the validation error below
  }
  if (!isValidBody(body)) {
    return Response.json({ error: "Message is required." }, { status: 400, headers: extraHeaders });
  }

  const { chunks, source } = await startReply(body);
  const headers = { ...extraHeaders, "X-YemiLLM-Source": source };

  if (!body.stream) {
    let reply = "";
    for await (const chunk of chunks) reply += chunk;
    return Response.json({ reply: cleanChatOutput(reply) }, { headers });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const next = await chunks.next();
        if (next.done) controller.close();
        else controller.enqueue(encoder.encode(next.value));
      } catch (err: any) {
        console.error("[yemiLLM] Stream error:", err?.message || err);
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      ...headers,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
