import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getGithubContributions, getGithubStats } from "./src/utils/githubData";
import { handleChatRequest } from "./src/utils/chatEngine";

const PORT = 3000;

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

  // GitHub Stats API endpoint
  app.get("/api/github-stats", async (_req, res) => {
    res.json(await getGithubStats());
  });

  // Dedicated GitHub Contributions Calendar endpoint
  app.get("/api/github-contributions", async (req, res) => {
    res.json(await getGithubContributions(req.query.refresh === "true"));
  });

  // Chat API endpoint (shared with the Vercel function in api/chat.ts)
  app.post("/api/chat", handleChatRequest);

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
