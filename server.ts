import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getGithubContributions, getGithubStats } from "./src/utils/githubData.js";
import { handleChatRequest } from "./src/utils/chatEngine.js";
import { handleTranscribeWebRequest } from "./src/utils/transcribe.js";

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  const app = express();
  app.use(express.json());

  app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    next();
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
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

  // Voice input endpoint (shared with the Vercel function in api/transcribe.ts)
  app.post("/api/transcribe", express.raw({ type: () => true, limit: "5mb" }), async (req, res) => {
    const headers = new Headers();
    for (const name of ["content-type", "origin", "x-forwarded-for"]) {
      const value = req.headers[name];
      if (typeof value === "string") headers.set(name, value);
    }
    if (!headers.has("x-forwarded-for") && req.socket.remoteAddress) headers.set("x-forwarded-for", req.socket.remoteAddress);
    const response = await handleTranscribeWebRequest(
      new Request("http://localhost/api/transcribe", { method: "POST", headers, body: req.body })
    );
    res.status(response.status).json(await response.json());
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
    app.get("*all", (req, res) => {
      const routePath = req.path.replace(/^\/+|\/+$/g, "");
      const routeFile = routePath
        ? path.join(distPath, ...routePath.split("/"), "index.html")
        : path.join(distPath, "index.html");
      res.sendFile(routeFile, (error) => {
        if (!error) return;
        res.status(404).sendFile(path.join(distPath, "404.html"));
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[askYemi] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
