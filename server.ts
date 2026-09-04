import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  YEMI_SYSTEM_INSTRUCTION,
  getSmartPortfolioReply,
} from "./src/utils/chatKnowledge";

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[askYemi] Warning: GEMINI_API_KEY is not set.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      assistant: "askYemi",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // High-quality contextual fallback if API key is missing in environment
        return res.json({
          reply:
            "I'm askYemi, Opeyemi's portfolio AI assistant! Right now, the AI backend key is being configured. In the meantime, feel free to explore Yemi's featured projects: **TASAfrica** (sports scout discovery), **Limestone App** (community security), and **Xeruit Talent** (AI hiring OS). You can reach Yemi directly at adegboyeopeyemi065@gmail.com!",
        });
      }

      const ai = getGenAI();

      // Format conversation history for Gemini multi-turn contents
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

      // Add current user prompt
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
      let lastError: any = null;

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
          console.warn(`[askYemi] Model ${model} failed or timed out. Error:`, err?.message || err);
          lastError = err;
        }
      }

      if (!replyText) {
        replyText = getSmartPortfolioReply(message);
      }

      res.json({ reply: replyText });
    } catch (error: any) {
      console.error("[askYemi API Error]:", error);
      const fallback = "I'm askYemi, Opeyemi's portfolio assistant! You can explore his featured case studies: **[TASAfrica](/projects/tasafrica)** and **[Limestone App](/projects/limestone)**, or reach him directly at [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com).";
      res.json({ reply: fallback });
    }
  });

  // Vite development middleware or static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[askYemi] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
