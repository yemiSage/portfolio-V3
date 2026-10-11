// Voice input for yemiLLM: forwards a short recording to Groq's Whisper and returns the
// text. Shared by the Express dev server (server.ts) and the Vercel function in api/.
import { firstIp, isAllowedOrigin } from "./chatEngine.js";

const GROQ_TRANSCRIBE_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
// Turbo is fast and detects the spoken language on its own.
const WHISPER_MODEL = "whisper-large-v3-turbo";
// Vercel rejects request bodies over 4.5MB; a minute of compressed speech is far smaller.
const MAX_AUDIO_BYTES = 4 * 1024 * 1024;
const TRANSCRIBE_TIMEOUT_MS = 20000;
// Per visitor (IP), per warm instance. The free tier allows 2K transcriptions a day.
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const requestLog = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(ip, recent);
  if (requestLog.size > 5000) requestLog.clear();
  return false;
}

function fileNameFor(contentType: string) {
  if (/mp4|m4a|aac/i.test(contentType)) return "speech.mp4";
  if (/ogg/i.test(contentType)) return "speech.ogg";
  if (/wav/i.test(contentType)) return "speech.wav";
  if (/mpeg|mp3/i.test(contentType)) return "speech.mp3";
  return "speech.webm";
}

const json = (body: unknown, status = 200) => Response.json(body, { status });

// The request body is the raw recording, with its MIME type as Content-Type.
export async function handleTranscribeWebRequest(request: Request): Promise<Response> {
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return json({ error: "Voice input is only available on Yemi's portfolio." }, 403);
  }
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return json({ error: "Voice input is not set up yet." }, 503);
  if (isRateLimited(firstIp(request.headers.get("x-forwarded-for")) || "unknown")) {
    return json({ error: "Too many voice messages. Please wait a few minutes and try again." }, 429);
  }

  const contentType = (request.headers.get("content-type") || "audio/webm").split(";")[0];
  if (!/^(audio|video)\//i.test(contentType)) return json({ error: "Expected an audio recording." }, 400);
  const audio = await request.arrayBuffer();
  if (audio.byteLength === 0) return json({ error: "The recording was empty." }, 400);
  if (audio.byteLength > MAX_AUDIO_BYTES) return json({ error: "That recording is too long. Please keep it under a minute." }, 413);

  const form = new FormData();
  form.append("file", new Blob([audio], { type: contentType }), fileNameFor(contentType));
  form.append("model", WHISPER_MODEL);
  form.append("response_format", "json");

  try {
    const res = await fetch(GROQ_TRANSCRIBE_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: AbortSignal.timeout(TRANSCRIBE_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[yemiLLM] transcription failed: HTTP ${res.status}`, (await res.text().catch(() => "")).slice(0, 300));
      return json({ error: "Couldn't understand that recording. Please try again or type your question." }, 502);
    }
    const data = (await res.json()) as any;
    return json({ text: String(data?.text || "").trim() });
  } catch (err: any) {
    console.warn("[yemiLLM] transcription error:", err?.message || err);
    return json({ error: "Voice input timed out. Please try again or type your question." }, 504);
  }
}
