import fs from "fs";
import path from "path";

export interface RagDocument {
  id: string;
  title: string;
  content: string;
}

const PROJECTS_DIR = path.join(process.cwd(), "src", "data", "projects");

export function loadRagDocuments(): RagDocument[] {
  try {
    if (!fs.existsSync(PROJECTS_DIR)) {
      return [];
    }
    const files = fs.readdirSync(PROJECTS_DIR);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const filePath = path.join(PROJECTS_DIR, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const id = file.replace(".md", "");
        const title = content.split("\n")[0].replace("#", "").trim();
        return { id, title, content };
      });
  } catch (err) {
    console.error("Error loading RAG documents:", err);
    return [];
  }
}

export function retrieveRelevantContext(query: string): string {
  const docs = loadRagDocuments();
  if (docs.length === 0) {
    return "No indexed project documents found.";
  }

  const normalizedQuery = query.toLowerCase();

  // Score each document based on occurrences of query terms
  const stopWords = new Set(["the", "a", "an", "and", "or", "but", "is", "of", "to", "in", "for", "on", "with", "at", "by", "what", "how", "who", "where", "why"]);
  const queryTerms = normalizedQuery
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2 && !stopWords.has(term));

  let bestDoc = docs[0];
  let highestScore = 0;

  // Direct keyword boosts to guide RAG mapping
  const boosts: { [key: string]: string[] } = {
    tasafrica: ["tasafrica", "tas", "africa", "sport", "scout", "athlete", "athletic", "soccer", "football", "talent"],
    limestone: ["limestone", "gate", "offline", "qr", "community", "estate", "pass", "visitor", "panic", "security"],
    resume: ["resume", "experience", "education", "childhood", "music", "background", "xeruit", "prep", "contact", "phone", "email", "whatsapp", "linkedin", "designer", "codes", "skills", "tools"]
  };

  for (const doc of docs) {
    let score = 0;
    const contentLower = doc.content.toLowerCase();

    // Word match scoring
    for (const term of queryTerms) {
      const occurrences = (contentLower.match(new RegExp("\\b" + term + "\\b", "g")) || []).length;
      score += occurrences * 1.5;
    }

    // Boost matching
    const docBoostWords = boosts[doc.id] || [];
    for (const boostWord of docBoostWords) {
      if (normalizedQuery.includes(boostWord)) {
        score += 25; // Massive boost for explicit mentions
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestDoc = doc;
    }
  }

  // If score is high enough, return the best matching document.
  // Otherwise, return a combined index of all available documents so the LLM has all context!
  if (highestScore > 3) {
    return `[RAG Retrieved Document: ${bestDoc.title}]\n\n${bestDoc.content}`;
  }

  // Combined fallback: return outline of all files so the LLM can synthesize answers with comprehensive scope
  return docs.map(d => `### ${d.title}\n${d.content}`).join("\n\n---\n\n");
}
