import { ROUTES, SITE, absoluteUrl, canonicalUrl } from "./site.js";

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const renderLinks = (links = []) => {
  if (!links.length) return "";
  return `<ul>${links
    .map(([label, href]) => `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`)
    .join("")}</ul>`;
};

export function renderRouteContent(route) {
  const sections = route.sections
    .map(
      (section) =>
        `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p>${renderLinks(section.links)}</section>`,
    )
    .join("");

  return `<main class="initial-route-content"><header><p>${route.type === "article" ? "Product design case study" : "Portfolio"}</p><h1>${escapeHtml(route.heading)}</h1><p>${escapeHtml(route.summary)}</p></header>${sections}<nav aria-label="Portfolio pages"><a href="/">Portfolio home</a><a href="/projects/tasafrica">TASAfrica</a><a href="/projects/limestone">Limestone</a><a href="/projects/stayafrika">StayAfrika</a></nav></main>`;
}

export function renderHead(route) {
  const canonical = canonicalUrl(route);
  const image = absoluteUrl(SITE.image);
  const robots = route.indexable
    ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    : "noindex, follow";
  const schema = route.schema
    ? `<script type="application/ld+json" data-discoverability="route">${JSON.stringify(route.schema).replaceAll("<", "\\u003c")}</script>`
    : "";

  return [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:type" content="${escapeHtml(route.type)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(SITE.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(SITE.imageAlt)}" />`,
    schema,
  ]
    .filter(Boolean)
    .join("\n    ");
}

function replaceMarkerBlock(html, name, content) {
  const start = `<!-- DISCOVERABILITY:${name}_START -->`;
  const end = `<!-- DISCOVERABILITY:${name}_END -->`;
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);
  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`Missing ${name} discoverability markers`);
  }
  return `${html.slice(0, startIndex + start.length)}\n    ${content}\n    ${html.slice(endIndex)}`;
}

export function renderRouteHtml(template, route) {
  const withHead = replaceMarkerBlock(template, "HEAD", renderHead(route));
  return replaceMarkerBlock(withHead, "CONTENT", renderRouteContent(route));
}

export function renderSitemap() {
  const entries = ROUTES.filter((route) => route.indexable)
    .map((route) => `  <url><loc>${escapeHtml(canonicalUrl(route))}</loc></url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

export function renderRobots() {
  return `# Opeyemi Adegboye portfolio crawler policy
# robots.txt manages crawling; it is not an access-control mechanism.
User-agent: *
Allow: /
Disallow: /api/

# Search and answer-engine discovery
User-agent: OAI-SearchBot
Allow: /
Disallow: /api/

User-agent: Googlebot
Allow: /
Disallow: /api/

User-agent: Bingbot
Allow: /
Disallow: /api/

User-agent: PerplexityBot
Allow: /
Disallow: /api/

# Model-training crawlers remain allowed under the portfolio's existing policy.
User-agent: GPTBot
Allow: /
Disallow: /api/

User-agent: Google-Extended
Allow: /
Disallow: /api/

Sitemap: ${SITE.origin}/sitemap.xml
`;
}

export function renderLlms() {
  return `# ${SITE.name}

> The official portfolio of Opeyemi Adegboye, a Design Engineer working across product design, design systems, prototyping and frontend interfaces.

## Canonical site

- [Portfolio home](${SITE.origin}/): Profile, capabilities, selected work and contact links.

## Public case studies

- [TASAfrica](${SITE.origin}/projects/tasafrica): Mobile-first sports talent discovery and role-aware product design.
- [Limestone](${SITE.origin}/projects/limestone): Community management, offline visitor access, onboarding and safety workflows.
- [StayAfrika](${SITE.origin}/projects/stayafrika): Travel marketplace flows, white-label storefronts, property payments and host messaging.

## Public resources

- [Resume PDF](${SITE.origin}/resume/opeyemi-adegboye-resume.pdf)
- [GitHub](https://github.com/yemiSage)
- [LinkedIn](https://www.linkedin.com/in/opeyemiadegboyeazeez/)

## Scope

This file summarizes maintained public portfolio content. It does not describe a public API or an MCP server, and it does not grant access to private endpoints or data.
`;
}

export function renderNotFoundHtml(template) {
  const route = {
    path: "/404",
    canonicalPath: "/404",
    indexable: false,
    title: `Page not found | ${SITE.name}`,
    description: "The requested portfolio page could not be found.",
    type: "website",
    heading: "Page not found",
    summary: "The requested portfolio page does not exist.",
    sections: [
      {
        heading: "Continue browsing",
        body: "Return to the portfolio home page or explore a published case study.",
        links: [["Portfolio home", "/"]],
      },
    ],
    schema: null,
  };
  return renderRouteHtml(template, route);
}
