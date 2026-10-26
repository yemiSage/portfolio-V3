import { ROUTES, SITE, absoluteUrl, canonicalUrl, getRoute } from "./site.js";

export const DISCOVERY_FILES = ["llms.txt", "robots.txt", "sitemap.xml"];

export function schemaNodes(value) {
  if (Array.isArray(value)) return value.flatMap(schemaNodes);
  if (!value || typeof value !== "object") return [];
  return [value, ...Object.values(value).flatMap(schemaNodes)];
}

export function schemaTypes(value) {
  return [...new Set(schemaNodes(value).flatMap((node) => node["@type"] || []))];
}

// Read evidence without substituting preview defaults for missing tags.
export function readPageEvidence(doc) {
  const content = (selector) => doc.head.querySelector(selector)?.getAttribute("content") || "";
  const schemas = [];
  const schemaErrors = [];
  doc.head.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    try {
      schemas.push(JSON.parse(script.textContent));
    } catch {
      schemaErrors.push("Invalid JSON-LD JSON");
    }
  });
  return {
    path: doc.location.pathname,
    title: doc.title,
    description: content('meta[name="description"]'),
    canonical: doc.head.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
    canonicalCount: doc.head.querySelectorAll('link[rel="canonical"]').length,
    robots: content('meta[name="robots"]'),
    language: doc.documentElement.lang,
    og: Object.fromEntries(["title", "description", "image", "url", "type", "locale", "site_name"].map(
      (key) => [key, content(`meta[property="og:${key}"]`)],
    )),
    twitter: Object.fromEntries(["card", "title", "description", "image"].map(
      (key) => [key, content(`meta[name="twitter:${key}"]`)],
    )),
    schemas,
    schemaErrors,
  };
}

export function assessDiscoveryDocument(kind, response) {
  const { status, contentType = "", body = "", sitemap } = response;
  const fail = (detail) => ({ passed: false, status, detail });
  if (status !== 200) return fail(`HTTP ${status}; could not verify ${kind}.`);
  if (/text\/html/i.test(contentType) || /^\s*(?:<!doctype html|<html)/i.test(body)) {
    return fail("Received an HTML page instead of the discovery document.");
  }
  const expectedUrls = ROUTES.filter((route) => route.indexable).map(canonicalUrl);
  if (kind === "llms.txt") {
    if (!/text\/plain/i.test(contentType) || !/^#\s+\S/m.test(body) ||
      expectedUrls.some((url) => !body.includes(`](${url})`))) {
      return fail("Expected a text guide linking to each maintained public page.");
    }
    return { passed: true, status, detail: "HTTP 200 · public guide available. Supplementary convention; no citation guarantee." };
  }
  if (kind === "robots.txt") {
    const lines = body.split(/\r?\n/).map((line) => line.replace(/#.*$/, "").trim()).filter(Boolean);
    const agents = lines.filter((line) => /^user-agent:\s*\S/i.test(line));
    if (!/text\/plain/i.test(contentType) || !agents.length ||
      !lines.some((line) => line === `Sitemap: ${SITE.origin}/sitemap.xml`)) {
      return fail("Expected crawler directives and the canonical sitemap reference.");
    }
    return { passed: true, status, agentCount: agents.length,
      detail: `HTTP 200 · ${agents.length} user-agent declarations · canonical sitemap referenced. Access policy requires separate review.` };
  }
  if (kind === "sitemap.xml") {
    const urls = sitemap?.urls || [];
    if (!/(?:application|text)\/(?:[\w.+-]*\+)?xml/i.test(contentType) || sitemap?.parseError ||
      sitemap?.rootName !== "urlset" || sitemap?.namespace !== "http://www.sitemaps.org/schemas/sitemap/0.9" ||
      urls.length !== expectedUrls.length || new Set(urls).size !== urls.length ||
      expectedUrls.some((url) => !urls.includes(url))) {
      return fail("Expected valid sitemap XML containing only the maintained canonical public URLs.");
    }
    return { passed: true, status, urlCount: urls.length,
      detail: `HTTP 200 · ${urls.length} canonical URLs listed. Listing does not confirm indexing.` };
  }
  return fail("Unsupported discovery document.");
}

export async function fetchDiscoveryDocument(kind, { signal, fetchImpl = globalThis.fetch, parseXml } = {}) {
  try {
    const response = await fetchImpl(`/${kind}`, { signal, cache: "no-store", credentials: "omit" });
    const body = await response.text();
    let sitemap;
    if (kind === "sitemap.xml") {
      const xml = (parseXml || ((text) => new DOMParser().parseFromString(text, "application/xml")))(body);
      sitemap = {
        parseError: Boolean(xml.querySelector("parsererror")),
        rootName: xml.documentElement.localName,
        namespace: xml.documentElement.namespaceURI,
        urls: Array.from(xml.getElementsByTagNameNS("http://www.sitemaps.org/schemas/sitemap/0.9", "loc"),
          (node) => node.textContent.trim()),
      };
    }
    return assessDiscoveryDocument(kind, { status: response.status,
      contentType: response.headers.get("content-type") || "", body, sitemap });
  } catch (error) {
    if (signal?.aborted) throw error;
    return { passed: false, detail: "Request failed; this document could not be verified from this browser." };
  }
}

export function buildDiagnosticReport(page, files = {}) {
  if (!page) return { score: null, pendingCount: 1, passedCount: 0, totalCount: 0, checks: [] };
  const route = getRoute(page.path);
  const checks = [];
  const add = (id, label, passed, detail) => checks.push({ id, label, passed, detail });
  const canonical = route ? canonicalUrl(route) : "";
  add("title", "Page title", Boolean(page.title.trim()) && (!route || page.title === route.title),
    `${page.title.length} characters · ${route ? "must match the maintained page title" : "title presence check"}. Character count is informational.`);
  add("description", "Meta description", Boolean(page.description.trim()) && (!route || page.description === route.description),
    `${page.description.length} characters · must describe the current page. Character count is informational.`);
  add("canonical", "Canonical URL", page.canonicalCount === 1 && Boolean(canonical) && page.canonical === canonical,
    page.canonical || "No canonical URL found.");
  const directives = page.robots.toLowerCase().split(/[\s,]+/);
  add("robots", route?.indexable ? "Public page indexing directive" : "Non-indexable page directive",
    route?.indexable ? directives.includes("index") && !directives.includes("noindex") && !directives.includes("none")
      : directives.includes("noindex") || directives.includes("none"),
    page.robots || "No robots metadata found. This checks page directives, not actual indexing.");
  add("language", "Document language", page.language === SITE.language, page.language || "No language declared.");
  add("og-tags", "Open Graph metadata", Boolean(route && page.og.title === page.title &&
    page.og.description === page.description && page.og.image === absoluteUrl(route?.image || SITE.image) &&
    page.og.url === canonical && page.og.type === route.type && page.og.locale === SITE.locale),
    "Checks actual title, description, image URL, canonical URL, type and locale tags. Image delivery is not tested here.");
  add("twitter-tags", "X Card metadata", page.twitter.card === "summary_large_image" &&
    page.twitter.title === page.title && page.twitter.description === page.description &&
    page.twitter.image === absoluteUrl(route?.image || SITE.image),
    "Checks actual card, title, description and image URL tags.");
  if (route?.schema || page.schemas.length || page.schemaErrors.length) {
    const actualTypes = schemaTypes(page.schemas);
    const expectedTypes = schemaTypes(route?.schema);
    add("jsonld", "JSON-LD syntax and expected entity types", !page.schemaErrors.length &&
      actualTypes.length > 0 && expectedTypes.every((type) => actualTypes.includes(type)),
      page.schemaErrors.length ? page.schemaErrors.join("; ") :
        `${actualTypes.join(", ") || "No typed entities found"}. This is not a full Schema.org or rich-results validation.`);
  }
  for (const kind of DISCOVERY_FILES) {
    const file = files[kind];
    add(kind, `${kind} response`, file?.passed ?? null, file?.detail || "Checking current-origin response…");
  }
  const passedCount = checks.filter((check) => check.passed === true).length;
  const pendingCount = checks.filter((check) => check.passed === null).length;
  return { checks, passedCount, pendingCount, totalCount: checks.length,
    score: pendingCount ? null : Math.round(passedCount / checks.length * 100) };
}
