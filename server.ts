import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const PORT = 3000;

const YEMI_SYSTEM_INSTRUCTION = `You are "askYemi" (also known as YemiAI), an intelligent, articulate, and friendly AI assistant living inside the portfolio of Opeyemi Adegboye (also known as "Yemi" or "yemiSage").

YOUR ROLE & IDENTITY:
- You speak as Yemi's interactive portfolio assistant. You represent Opeyemi Adegboye's professional voice: thoughtful, craft-oriented, pragmatic, and passionate about product design and front-end engineering.
- When answering, be concise, engaging, and well-structured. Use clean formatting, bullet points, and bold text for readability. Avoid bloated rambling.

WHO IS OPEYEMI ADEGBOYE ("YEMI")?
- Title: Digital Product Designer & UI/UX Designer who codes.
- Tagline: "Need a Professional Product Designer Who Codes?" / "I design clear, intentional experiences for complex products, from B2B, B2C and SaaS platforms to marketplaces, AI-integrated systems, and operational products, balancing user needs with business goals."
- Core Philosophy: Designing with real-world engineering constraints in mind. Bridging the gap between Figma design systems and robust production code to create intuitive, conversion-driving, high-usability products.
- Contact Email: adegboyeopeyemi065@gmail.com
- Resume: Available on the portfolio (viewable directly on the site or downloadable as a PDF).

CORE FEATURED PROJECTS:
1. TASAfrica (Case Study available):
   - Scope: Scalable design system and discovery flows connecting African sports talent with international scouts and clubs.
   - Tags: AI, Sport, Social, Analytics.
   - Key Work: Designed talent categories, video highlights with frame-by-frame scout analytics, community feed, and onboarding/verification workflows.
   - Direct link: /projects/tasafrica

2. Limestone App (Case Study available):
   - Scope: High-security community living platform for gated estates and B2B residential complexes.
   - Tags: Community, Security, Real Estate, B2B.
   - Key Work: Solved gate bottlenecks with offline check-ins, instant panic alerts, clear resident-to-security workflows, and admin dashboards.
   - Direct link: /projects/limestone

3. Xeruit Talent:
   - Scope: AI hiring operating system connecting verified tech and creative talent with global recruiters.
   - Tags: AI, Hiring, SaaS, B2B.
   - Key Work: Recruiter discovery pipelines, talent vetting interfaces, automated candidate matching.

NOTABLE CONTRIBUTED PROJECTS:
- Norocio (2026, In development): Cross-border payments platform for global transfers, multi-currency accounts, and stablecoin.
- Stayafrika (2026): Travel marketplace for discovering stays, local experiences, and travel services across Africa.
- Soludesks (2026): B2B SaaS platform for managing team learning, support, attendance, and business operations.
- Feexeet (2026): Service marketplace connecting homeowners and businesses with verified service professionals.
- Flxfleet (2025): Canadian logistics platform for moving, delivery, driver booking, and real-time tracking.
- AfternoonPrep (2025): UK-based education platform for exam preparation, student practice, and analytics.
- The Ark (2025): Faith community app for connection, Bible study, and social sharing (available on Google Play Store).

TOOLBOX & TECHNICAL SKILLS:
- Design: Figma (Design systems, auto-layout, token management, interactive prototypes), Adobe Illustrator, Photoshop, Miro.
- AI & Modern Tools: Google AI Studio, Antigravity, Claude, OpenAI/Codex, Prompt Engineering, UI AI integration.
- Engineering & Web: HTML5, CSS3, JavaScript, React, Tailwind CSS, VS Code, Git, WordPress.
- Collaboration: Notion, Trello, Microsoft Suite, Agile sprints.

HOW TO RESPOND:
- If asked about projects, highlight TASAfrica, Limestone, and Xeruit, and mention what problem each solved. Provide clickable markdown links like [View TASAfrica Case Study](/projects/tasafrica) or [View Limestone Case Study](/projects/limestone) where relevant.
- If asked about hiring or contacting Yemi, provide his direct email (adegboyeopeyemi065@gmail.com) and mention he is available for full-time, contract, or design consulting roles.
- If asked about his design process, highlight: Research & Discovery -> Problem Framing -> Wireframing & Prototyping -> Design Systems & Polish -> Engineering Handoff / Code Collaboration.
- If asked a question unrelated to design, tech, or Yemi, gently bring the conversation back to Yemi's portfolio and capabilities.`;

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
        "gemini-3.6-flash",
      ];

      function getSmartFallback(query: string): string {
        const q = query.toLowerCase().trim();

        if (q.includes("inspire") || q.includes("inspiration") || q.includes("motivated")) {
          return "I find inspiration in ambitious people who are highly intentional about what they do. Surrounding myself with that kind of energy really pushes me to do better work. I also draw inspiration from the challenges I see around me and the desire to create meaningful experiences through design and technology.";
        }
        if (q.includes("process") || q.includes("workflow") || q.includes("how do you design")) {
          return "My design process begins with deep problem framing and business alignment. I move rapidly from wireframes into high-fidelity Figma components and interactive prototypes, validating with users and stakeholders early. Because I code, I also test edge cases in HTML/React to ensure frictionless developer handoffs and production polish.";
        }
        if (q.includes("favorite") || q.includes("love about design") || q.includes("parts of design")) {
          return "My favorite part of design is taking messy, intricate domain complexities—like gated community security handoffs or sports scout video analysis—and turning them into simple, elegant workflows where users feel completely in control.";
        }
        if (q.includes("unique") || q.includes("approach") || q.includes("differentiator") || q.includes("stand out")) {
          return "What makes my approach unique is bridging the gap between product design and engineering. As a designer who codes, I design with technical feasibility, component modularity, and operational constraints in mind from day one.";
        }
        if (q.includes("tasafrica") || q.includes("sport") || q.includes("scout")) {
          return "For **TASAfrica**, Yemi designed a scalable design system and discovery platform connecting African sports talent with international scouts and clubs. Key features include talent categories, video highlights with frame-by-frame scout analytics, a community feed, and onboarding verification workflows. You can explore the full breakdown here: [View TASAfrica Case Study](/projects/tasafrica).";
        }
        if (q.includes("limestone") || q.includes("security") || q.includes("estate") || q.includes("gate")) {
          return "For **Limestone App**, Yemi simplified gated community living by designing offline check-in workflows, instant panic alerts, clearer security handoffs, and property admin dashboards. Check out the full case study here: [View Limestone Case Study](/projects/limestone).";
        }
        if (q.includes("xeruit") || q.includes("hiring") || q.includes("talent")) {
          return "For **Xeruit Talent**, Yemi designed an AI-driven operating system connecting global companies with vetted African tech and creative talent, featuring skills benchmarking, candidate scorecards, and client management portals.";
        }
        if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("reach") || q.includes("touch")) {
          return "You can reach Yemi directly via email at [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com). Yemi is open to full-time roles, contract projects, and design consulting. You can also view his background in the [Resume](/resume) section!";
        }
        if (q.includes("tool") || q.includes("stack") || q.includes("software") || q.includes("figma") || q.includes("code")) {
          return "Yemi bridges product design and engineering using a modern stack: **Figma** (design systems, auto-layout, prototypes), **HTML5/CSS3/React**, **Google AI Studio / Claude / Antigravity**, **Adobe Illustrator/Photoshop**, **Miro**, and **Notion/VS Code**.";
        }
        if (q.includes("project") || q.includes("work") || q.includes("portfolio")) {
          return "Yemi's core featured projects include:\n\n*   **[TASAfrica](/projects/tasafrica)** — Sports discovery & scouting platform\n*   **[Limestone App](/projects/limestone)** — High-security estate and residential living software\n*   **Xeruit Talent** — AI-powered tech and creative hiring OS\n*   **Contributed products:** Norocio (cross-border fintech), Stayafrika (African travel marketplace), Soludesks (B2B SaaS), and Flxfleet (logistics).\n\nFeel free to ask about any specific project!";
        }

        return "Yemi is a Product Designer Who Codes, specializing in complex B2B, B2C, SaaS, and AI-integrated products. Explore his case studies ([TASAfrica](/projects/tasafrica), [Limestone App](/projects/limestone)), check his [Resume](/resume), or send an email to [adegboyeopeyemi065@gmail.com](mailto:adegboyeopeyemi065@gmail.com)!";
      }

      let replyText = "";
      let lastError: any = null;

      for (const model of CANDIDATE_MODELS) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 3500)
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
        replyText = getSmartFallback(message);
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
