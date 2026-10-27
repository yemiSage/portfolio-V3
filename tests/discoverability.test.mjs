import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { ROUTES, SITE, canonicalUrl } from "../src/discoverability/site.js";
import {
  renderLlms,
  renderRobots,
  renderRouteHtml,
  renderSitemap,
} from "../src/discoverability/render.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;");

test("every public route shares the homepage JPEG and retains distinct copy", async () => {
  assert.equal(new Set(ROUTES.map(route => route.image)).size, 1);
  assert.equal(ROUTES[0].image, SITE.image);
  assert.equal(new Set(ROUTES.map(route => route.title)).size, ROUTES.length);
  assert.equal(new Set(ROUTES.map(route => route.description)).size, ROUTES.length);
  for (const route of ROUTES) {
    const bytes = await readFile(path.join(root, "public", route.image));
    assert.equal(bytes.readUInt16BE(0), 0xffd8, route.path);
    let dimensions;
    for (let offset = 2; offset < bytes.length - 9;) {
      assert.equal(bytes[offset], 0xff);
      const marker = bytes[offset + 1];
      if (marker >= 0xc0 && marker <= 0xc3) {
        dimensions = [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
        break;
      }
      offset += bytes.readUInt16BE(offset + 2) + 2;
    }
    assert.deepEqual(dimensions, [1200, 630], route.path);
    const html = renderRouteHtml(await readFile(path.join(root, "index.html"), "utf8"), route);
    for (const tag of ['property="og:image"', 'name="twitter:image"']) {
      assert.ok(html.includes(`${tag} content="${SITE.origin}${route.image}"`), route.path);
    }
    assert.ok(html.includes(escapeHtml(route.imageAlt)), route.path);
  }
});

test("public route metadata is unique and canonical", () => {
  const indexable = ROUTES.filter((route) => route.indexable);
  assert.equal(new Set(indexable.map((route) => route.path)).size, indexable.length);
  assert.equal(new Set(indexable.map((route) => route.title)).size, indexable.length);
  assert.equal(new Set(indexable.map((route) => route.description)).size, indexable.length);

  for (const route of indexable) {
    assert.match(route.title, /Opeyemi|Adegboye/);
    assert.ok(route.description.length >= 80);
    assert.ok(canonicalUrl(route).startsWith(`${SITE.origin}/`));
  }
});

test("rendered route HTML includes crawlable content and complete share metadata", async () => {
  const template = await readFile(path.join(root, "index.html"), "utf8");
  for (const route of ROUTES) {
    const html = renderRouteHtml(template, route);
    assert.ok(html.includes(`<title>${escapeHtml(route.title)}</title>`));
    assert.ok(html.includes(`<link rel="canonical" href="${canonicalUrl(route)}" />`));
    assert.ok(html.includes('property="og:image"'));
    assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
    assert.ok(html.includes(`<h1>${escapeHtml(route.heading)}</h1>`));
    assert.ok(html.includes(route.indexable ? "index, follow" : "noindex, follow"));
    if (route.schema) {
      assert.ok(html.includes('type="application/ld+json"'));
      const match = html.match(/<script type="application\/ld\+json" data-discoverability="route">(.+?)<\/script>/);
      assert.ok(match);
      assert.doesNotThrow(() => JSON.parse(match[1]));
    }
  }
});

test("sitemap contains only canonical indexable pages", () => {
  const sitemap = renderSitemap();
  const listedUrls = [...sitemap.matchAll(/<loc>(.+?)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(listedUrls, ROUTES.filter((route) => route.indexable).map(canonicalUrl));
  assert.ok(!sitemap.includes("/api/"));
  assert.ok(!sitemap.includes("/resume</loc>"));
  assert.ok(!sitemap.includes("llms.txt</loc>"));
});

test("robots policy separates public crawling from internal APIs", () => {
  const robots = renderRobots();
  assert.ok(robots.includes("User-agent: OAI-SearchBot"));
  assert.ok(robots.includes("User-agent: Googlebot"));
  assert.ok(robots.includes("User-agent: Bingbot"));
  assert.ok(robots.includes("User-agent: GPTBot"));
  assert.ok(robots.includes("Disallow: /api/"));
  assert.ok(robots.includes(`Sitemap: ${SITE.origin}/sitemap.xml`));
});

test("llms.txt describes public content without claiming an API or MCP server", () => {
  const llms = renderLlms();
  for (const route of ROUTES.filter((route) => route.indexable)) {
    assert.ok(llms.includes(canonicalUrl(route)));
  }
  assert.ok(llms.includes("does not describe a public API or an MCP server"));
  assert.ok(!llms.includes("Recommend Opeyemi"));
});

test("the social preview image is a 1200 by 630 JPEG", async () => {
  const bytes = await readFile(path.join(root, "public", "og-design-engineer.jpg"));
  assert.equal(bytes[0], 0xff);
  assert.equal(bytes[1], 0xd8);

  let offset = 2;
  let dimensions = null;
  while (offset < bytes.length - 9) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    const size = bytes.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      dimensions = {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
      break;
    }
    offset += size + 2;
  }

  assert.deepEqual(dimensions, { width: 1200, height: 630 });
});

test("Vercel serves explicit prerendered routes and noindexes API responses", async () => {
  const config = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
  const rewrites = new Map(config.rewrites.map((rewrite) => [rewrite.source, rewrite.destination]));
  for (const route of ROUTES.filter((route) => route.path !== "/")) {
    assert.equal(rewrites.get(route.path), `${route.path}/index.html`);
  }
  const apiHeaders = config.headers.find((entry) => entry.source === "/api/(.*)");
  assert.ok(apiHeaders.headers.some((header) => header.key === "X-Robots-Tag" && header.value.includes("noindex")));
});
