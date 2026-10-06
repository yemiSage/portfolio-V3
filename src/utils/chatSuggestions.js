// Suggested questions for the yemiLLM chat. Instant, context-aware suggestions are built
// here from the page, the question and the answer; the server can then swap in
// model-written ones (see fetchAiSuggestions).

const TOPICS = {
  work: {
    match: /work with|hire|hiring|collaborat|engage|freelanc|full.?time|contract|available|availability|rate|pricing|upwork/,
    questions: [
      "How can I work with Yemi?",
      "Is Yemi open to full-time roles?",
      "Does Yemi take freelance projects?",
      "How does a project with Yemi start?",
    ],
    related: ["contact", "projects", "process"],
  },
  contact: {
    match: /contact|reach|phone|whatsapp|email|linkedin|upwork|call|message him/,
    questions: [
      "How can I contact Yemi?",
      "What is the best way to reach Yemi quickly?",
      "Where can I see Yemi's resume?",
    ],
    related: ["work", "resume"],
  },
  projects: {
    match: /project|portfolio|case stud|built|shipped|work on|products?\b/,
    questions: [
      "What kind of projects does Yemi work on?",
      "Which project is Yemi most proud of?",
      "What industries has Yemi designed for?",
    ],
    related: ["tasafrica", "limestone", "xeruit"],
  },
  process: {
    match: /process|approach|framework|method|workflow|research|think|how does he design|principles?/,
    questions: [
      "What is Yemi's design process?",
      "How does Yemi use research in his designs?",
      "How does Yemi work with developers?",
      "What makes Yemi's design approach different?",
    ],
    related: ["tools", "projects", "ai"],
  },
  tasafrica: {
    match: /tasafrica|sport|athlete|scout|talent discovery|tournament/,
    questions: [
      "Tell me about TASAfrica",
      "What was Yemi's role on TASAfrica?",
      "What key decisions shaped TASAfrica?",
      "What results did TASAfrica see?",
    ],
    related: ["limestone", "process", "work"],
  },
  limestone: {
    match: /limestone|estate|gated|offline|qr|panic|security|community management/,
    questions: [
      "What problem does Limestone solve?",
      "How does Limestone's offline check-in work?",
      "What was Yemi's role on Limestone?",
      "How did Limestone handle emergencies?",
    ],
    related: ["tasafrica", "process", "work"],
  },
  xeruit: {
    match: /xeruit|recruit|hiring os|cv analysis|candidate/,
    questions: [
      "Tell me about Xeruit Talent",
      "How did Xeruit reach 3,000 users?",
      "How did Yemi design AI into Xeruit?",
    ],
    related: ["ai", "projects", "tasafrica"],
  },
  ai: {
    match: /\bai\b|llm|artificial|automation|agent|gemini|prompt|machine learning/,
    questions: [
      "How does Yemi use AI in his work?",
      "Has Yemi designed AI products before?",
      "What AI tools does Yemi build with?",
    ],
    related: ["xeruit", "tools", "process"],
  },
  tools: {
    match: /tool|tech|stack|figma|react|code|coding|engineer|front.?end|skills?/,
    questions: [
      "What tools and tech does Yemi use?",
      "Does Yemi write code?",
      "What are Yemi's strongest skills?",
    ],
    related: ["process", "ai", "projects"],
  },
  background: {
    match: /background|story|who is|about yemi|age|born|education|electrical|journey|grew|childhood|inspir|mentor/,
    questions: [
      "What inspires Yemi?",
      "How did Yemi get into product design?",
      "Tell me about Yemi's background",
      "Does Yemi mentor other designers?",
    ],
    related: ["process", "projects", "work"],
  },
  resume: {
    match: /resume|cv\b|experience|years|career|worked at|employer/,
    questions: [
      "How many years of experience does Yemi have?",
      "Where has Yemi worked before?",
      "Where can I see Yemi's resume?",
    ],
    related: ["projects", "work", "contact"],
  },
};

const PAGE_TOPICS = {
  "/projects/tasafrica": "tasafrica",
  "/projects/limestone": "limestone",
  "/resume": "resume",
};

const STARTER_POOL = [
  "How can I work with Yemi?",
  "What kind of projects does Yemi work on?",
  "What is Yemi's design process?",
  "How can I contact Yemi?",
  "Tell me about TASAfrica",
  "What problem does Limestone solve?",
  "How does Yemi use AI in his work?",
  "What inspires Yemi?",
];

const normalize = (q) => q.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

// Treat near-identical wording as the same question so nothing is suggested twice.
function sameQuestion(a, b) {
  const x = new Set(normalize(a).split(" "));
  const y = new Set(normalize(b).split(" "));
  const shared = [...x].filter((w) => y.has(w)).length;
  return shared / Math.max(x.size, y.size) >= 0.75;
}

function pageTopic(path = "") {
  return PAGE_TOPICS[path.replace(/\/+$/, "")] || null;
}

function askedQuestions(history = []) {
  return history.filter((m) => m.role === "user").map((m) => m.content || "");
}

function rankTopics(query, reply, path) {
  const q = query.toLowerCase();
  const r = reply.toLowerCase();
  const onPage = pageTopic(path);
  return Object.entries(TOPICS)
    .map(([id, topic]) => {
      let score = 0;
      if (topic.match.test(q)) score += 3;
      if (topic.match.test(r)) score += 1;
      if (id === onPage) score += 0.5;
      return { id, score };
    })
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((t) => t.id);
}

function takeUnasked(pool, asked, chosen, count) {
  const out = [];
  for (const question of pool) {
    if (out.length >= count) break;
    if (asked.some((a) => sameQuestion(a, question))) continue;
    if (chosen.some((c) => sameQuestion(c, question)) || out.some((c) => sameQuestion(c, question))) continue;
    out.push(question);
  }
  return out;
}

// Opening suggestions: lead with the page the visitor is on, then a varied mix.
export function getStarterSuggestions(path = "") {
  const onPage = pageTopic(path);
  const picked = [];
  if (onPage) picked.push(...TOPICS[onPage].questions.slice(0, 2));
  const pool = [...STARTER_POOL].sort(() => Math.random() - 0.5);
  picked.push(...takeUnasked(pool, [], picked, 4 - picked.length));
  return picked.slice(0, 4);
}

// Follow-ups for the answer just given: go deeper on the current topic, then move to
// related ones, skipping anything already asked.
export function getFollowUpSuggestions({ query = "", reply = "", history = [], path = "" }) {
  const asked = [...askedQuestions(history), query];
  const ranked = rankTopics(query, reply, path);
  const current = ranked[0];
  const chosen = [];

  if (current) {
    chosen.push(...takeUnasked(TOPICS[current].questions.slice(1), asked, chosen, 2));
    const related = [...new Set([...TOPICS[current].related, ...ranked.slice(1)])].filter((id) => id !== current);
    for (const id of related) {
      if (chosen.length >= 4) break;
      chosen.push(...takeUnasked(TOPICS[id].questions, asked, chosen, 1));
    }
  }
  const onPage = pageTopic(path);
  if (chosen.length < 4 && onPage && onPage !== current) {
    chosen.push(...takeUnasked(TOPICS[onPage].questions, asked, chosen, 4 - chosen.length));
  }
  if (chosen.length < 4) {
    chosen.push(...takeUnasked(STARTER_POOL, asked, chosen, 4 - chosen.length));
  }
  return chosen.slice(0, 4);
}

// Model-written follow-ups from the server. Resolves to [] when unavailable.
export async function fetchAiSuggestions({ query, reply, history, path, pageTitle }) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "suggest",
        message: query,
        reply: reply.slice(0, 1500),
        history: history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        context: { currentPath: path, pageTitle },
      }),
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.suggestions) ? data.suggestions.filter((s) => typeof s === "string").slice(0, 4) : [];
  } catch {
    return [];
  }
}
