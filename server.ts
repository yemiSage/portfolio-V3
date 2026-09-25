import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  YEMI_SYSTEM_INSTRUCTION,
  getSmartPortfolioReply,
  cleanChatOutput,
} from "./src/utils/chatKnowledge";
import { retrieveRelevantContext } from "./src/utils/ragServer";

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

  // In-memory cache for GitHub statistics (TTL: 15 minutes)
  let githubCache: { data: any; timestamp: number } | null = null;
  const GITHUB_CACHE_TTL = 15 * 60 * 1000;

  const DEFAULT_GITHUB_STATS = {
    username: "yemiSage",
    name: "Adegboye Opeyemi",
    profileUrl: "https://github.com/yemiSage",
    avatarUrl: "https://avatars.githubusercontent.com/u/114894864?v=4",
    bio: "UI/UX Designer | Framer Developer",
    projectsShipped: 2,
    prs: 0,
    commitsThisYear: 70,
    totalProjects: 5,
    year: 2026,
    followers: 10,
    following: 11,
    publicGists: 5,
    topLanguages: ["TypeScript", "JavaScript", "HTML"],
    featuredRepos: [
      {
        name: "PHA_WebApp",
        url: "https://github.com/yemiSage/PHA_WebApp",
        demo: "https://pha-pi.vercel.app",
        description: "Web application for Product Hub Africa",
        language: "TypeScript",
        isShipped: true,
      },
      {
        name: "portfolio-V3",
        url: "https://github.com/yemiSage/portfolio-V3",
        demo: "https://portfolio-v3-flame-two.vercel.app",
        description: "Official portfolio website built with modern React",
        language: "JavaScript",
        isShipped: true,
      },
      {
        name: "soludesks",
        url: "https://github.com/yemiSage/soludesks",
        demo: null,
        description: "Modern productivity and workspace application",
        language: "TypeScript",
        isShipped: false,
      },
    ],
  };

  // GitHub Stats API endpoint
  app.get("/api/github-stats", async (_req, res) => {
    const now = Date.now();
    if (githubCache && now - githubCache.timestamp < GITHUB_CACHE_TTL) {
      return res.json(githubCache.data);
    }

    try {
      const headers: Record<string, string> = {
        "User-Agent": "yemi-portfolio",
        Accept: "application/vnd.github.v3+json",
      };

      const [userRes, reposRes] = await Promise.all([
        fetch("https://api.github.com/users/yemiSage", { headers }),
        fetch("https://api.github.com/users/yemiSage/repos?per_page=100&sort=updated", { headers }),
      ]);

      if (!userRes.ok || !reposRes.ok) {
        return res.json(githubCache?.data || DEFAULT_GITHUB_STATS);
      }

      const userData = (await userRes.json()) as any;
      const reposData = (await reposRes.json()) as any[];

      let projectsShipped = 0;
      const languagesSet = new Set<string>();

      if (Array.isArray(reposData)) {
        for (const repo of reposData) {
          if (repo.homepage && repo.homepage.trim().length > 0) {
            projectsShipped++;
          }
          if (repo.language) {
            languagesSet.add(repo.language);
          }
        }
      }

      // Ensure at least 2 shipped based on live production sites
      if (projectsShipped < 2) {
        projectsShipped = 2;
      }

      let commitsThisYear = 70;
      try {
        const commitRes = await fetch(
          "https://api.github.com/search/commits?q=author:yemiSage+author-date:>=2026-01-01",
          {
            headers: {
              ...headers,
              Accept: "application/vnd.github.cloak-preview",
            },
          }
        );
        if (commitRes.ok) {
          const commitData = (await commitRes.json()) as any;
          if (typeof commitData.total_count === "number" && commitData.total_count > 0) {
            commitsThisYear = commitData.total_count;
          }
        }
      } catch {
        // fallback to cached/default commits
      }

      let prs = 0;
      try {
        const prRes = await fetch(
          "https://api.github.com/search/issues?q=author:yemiSage+type:pr",
          { headers }
        );
        if (prRes.ok) {
          const prData = (await prRes.json()) as any;
          if (typeof prData.total_count === "number") {
            prs = prData.total_count;
          }
        }
      } catch {
        // fallback to default PRs
      }

      const liveData = {
        username: userData.login || "yemiSage",
        name: userData.name || "Adegboye Opeyemi",
        profileUrl: userData.html_url || "https://github.com/yemiSage",
        avatarUrl: userData.avatar_url || "https://avatars.githubusercontent.com/u/114894864?v=4",
        bio: userData.bio || "UI/UX Designer | Framer Developer",
        projectsShipped,
        prs,
        commitsThisYear,
        totalProjects: userData.public_repos || (Array.isArray(reposData) ? reposData.length : 5),
        year: 2026,
        followers: userData.followers ?? 10,
        following: userData.following ?? 11,
        publicGists: userData.public_gists ?? 5,
        topLanguages: Array.from(languagesSet),
        featuredRepos: Array.isArray(reposData)
          ? reposData.slice(0, 3).map((r) => ({
              name: r.name,
              url: r.html_url,
              demo: r.homepage || null,
              description: r.description,
              language: r.language,
              isShipped: Boolean(r.homepage && r.homepage.trim().length > 0),
            }))
          : DEFAULT_GITHUB_STATS.featuredRepos,
      };

      githubCache = {
        data: liveData,
        timestamp: now,
      };

      return res.json(liveData);
    } catch (error) {
      console.warn("[github-stats] Error fetching GitHub data:", error);
      return res.json(DEFAULT_GITHUB_STATS);
    }
  });

  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, context } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // High-quality contextual fallback if API key is missing in environment
        return res.json({
          reply: cleanChatOutput(
            "This is Yemi LLM, Opeyemi's portfolio assistant. Feel free to explore Yemi's featured projects: TASAfrica (sports scout discovery), Limestone App (community security), and Xeruit Talent (AI hiring OS). You can reach Yemi directly at adegboyeopeyemi065@gmail.com!"
          ),
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

      // Retrieve high-fidelity context dynamically from the project & page markdown files via the RAG pipeline
      const ragContext = retrieveRelevantContext(message);

      for (const model of CANDIDATE_MODELS) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 6500)
          );

          let dynamicSystemInstruction = YEMI_SYSTEM_INSTRUCTION;
          if (ragContext) {
            dynamicSystemInstruction += `\n\n[RAG SYSTEM PORTFOLIO KNOWLEDGE BASE]\nThe following is highly accurate, extracted context from Opeyemi's official project and page markdown documents. Use it to answer any specific or implicit questions about his portfolio projects, key metrics, client results, background, skills, contact channels, or work philosophy with deep, context-rich intelligence:\n"""\n${ragContext}\n"""`;
          }
          if (context && typeof context === "object") {
            dynamicSystemInstruction += `\n\n[USER SCREEN CONTEXT]\nThe user is currently browsing the page: "${context.currentPath || '/'}".\nPage Title: "${context.pageTitle || ''}".\nHere is the visible content on this page:\n"""\n${context.extractedText || ''}\n"""\nYou are fully aware of everything on this page. When the user asks "what is this page about?", "who is this?", or questions about any text, details, metrics, case studies, sections, or bullet points on this screen, use the visible text above to answer accurately and intelligently as if you are looking at their screen!`;
          }

          const generatePromise = ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: dynamicSystemInstruction,
              temperature: 0.85,
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

      res.json({ reply: cleanChatOutput(replyText) });
    } catch (error: any) {
      console.error("[askYemi API Error]:", error);
      const fallback = cleanChatOutput(
        "Yemi is a Product Designer Who Codes with over 4 years of experience. You can explore his featured case studies: [TASAfrica](/projects/tasafrica) and [Limestone App](/projects/limestone), or reach him directly at [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)."
      );
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
