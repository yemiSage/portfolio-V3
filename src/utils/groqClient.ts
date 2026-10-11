// Minimal Groq client (OpenAI-compatible chat completions API) for yemiLLM.
// Used ahead of Gemini when GROQ_API_KEY is set.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Tried in order. GPT-OSS 120B is the strongest model on Groq's free tier; Llama 3.3 70B
// is the fallback. Override with a comma-separated GROQ_MODELS env var.
const DEFAULT_GROQ_MODELS = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile"];

export type GroqMessage = { role: "system" | "user" | "assistant"; content: string };

export function getGroqModels(): string[] {
  const fromEnv = (process.env.GROQ_MODELS || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_GROQ_MODELS;
}

// GPT-OSS models reason before answering; a low effort keeps replies quick. Other models
// reject the setting, so it is only sent to GPT-OSS.
function reasoningFor(model: string) {
  return /gpt-oss/i.test(model) ? { reasoning_effort: "low" } : {};
}

function requestInit(apiKey: string, payload: Record<string, unknown>, signal?: AbortSignal): RequestInit {
  return {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  };
}

// Streams the reply text. Throws on HTTP errors so the caller can try the next model.
export async function* streamGroqChat(
  apiKey: string,
  model: string,
  messages: GroqMessage[],
  options: { temperature: number; maxTokens: number; signal?: AbortSignal }
): AsyncGenerator<string> {
  const res = await fetch(
    GROQ_URL,
    requestInit(
      apiKey,
      {
        model,
        messages,
        temperature: options.temperature,
        max_completion_tokens: options.maxTokens,
        stream: true,
        ...reasoningFor(model),
      },
      options.signal
    )
  );
  if (!res.ok || !res.body) {
    throw new Error(`Groq ${model} HTTP ${res.status}: ${(await res.text().catch(() => "")).slice(0, 300)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const data = line.trim();
      if (!data.startsWith("data:")) continue;
      const payload = data.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const text = JSON.parse(payload)?.choices?.[0]?.delta?.content;
        if (text) yield text;
      } catch {
        // Ignore keep-alive or partial lines.
      }
    }
  }
}

// One-shot JSON reply (used for follow-up suggestions).
export async function groqJson(
  apiKey: string,
  model: string,
  messages: GroqMessage[],
  options: { temperature: number; maxTokens: number; signal?: AbortSignal }
): Promise<string> {
  const res = await fetch(
    GROQ_URL,
    requestInit(
      apiKey,
      {
        model,
        messages,
        temperature: options.temperature,
        max_completion_tokens: options.maxTokens,
        response_format: { type: "json_object" },
        ...reasoningFor(model),
      },
      options.signal
    )
  );
  if (!res.ok) throw new Error(`Groq ${model} HTTP ${res.status}`);
  const json = (await res.json()) as any;
  return json?.choices?.[0]?.message?.content || "";
}
