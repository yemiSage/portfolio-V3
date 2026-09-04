import { GoogleGenAI } from "@google/genai";
import { YEMI_SYSTEM_INSTRUCTION, getSmartPortfolioReply } from "../src/utils/chatKnowledge";

let aiClient: GoogleGenAI | null = null;
function getGenAI(apiKey: string): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  // CORS & Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Smart knowledge fallback if GEMINI_API_KEY is not yet added in Vercel Environment Variables
      const reply = getSmartPortfolioReply(message);
      res.status(200).json({ reply });
      return;
    }

    const ai = getGenAI(apiKey);

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-8)) {
        if (item.role === "user" || item.role === "assistant" || item.role === "model") {
          contents.push({
            role: item.role === "assistant" ? "model" : "user",
            parts: [{ text: String(item.content || item.text || "") }],
          });
        }
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const CANDIDATE_MODELS = [
      "gemini-3.8-flash",
      "gemini-3.6-flash",
      "gemini-flash-latest",
    ];

    let replyText = "";
    for (const model of CANDIDATE_MODELS) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 4000)
        );

        const generatePromise = ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: YEMI_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
        if (response && response.text) {
          replyText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`[api/chat] Model ${model} failed:`, err?.message || err);
      }
    }

    if (!replyText) {
      replyText = getSmartPortfolioReply(message);
    }

    res.status(200).json({ reply: replyText });
  } catch (err: any) {
    console.error("[api/chat error]:", err);
    res.status(200).json({ reply: getSmartPortfolioReply(req.body?.message || "") });
  }
}
