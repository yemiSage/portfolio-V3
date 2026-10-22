import assert from "node:assert/strict";
import test from "node:test";
import { ROUTES, SITE, absoluteUrl, canonicalUrl } from "../src/discoverability/site.js";
import { renderLlms, renderRobots, renderSitemap } from "../src/discoverability/render.js";
import { assessDiscoveryDocument, buildDiagnosticReport, fetchDiscoveryDocument, schemaTypes } from "../src/discoverability/diagnostics.js";

const fixture = (route = ROUTES[0]) => ({
  path: route.path, title: route.title, description: route.description,
  canonical: canonicalUrl(route), canonicalCount: 1, language: SITE.language,
  robots: route.indexable ? "index, follow" : "noindex, follow",
  og: { title: route.title, description: route.description, image: absoluteUrl(SITE.image),
    url: canonicalUrl(route), type: route.type, locale: SITE.locale },
  twitter: { card: "summary_large_image", title: route.title, description: route.description, image: absoluteUrl(SITE.image) },
  schemas: route.schema ? [route.schema] : [], schemaErrors: [],
});
const sitemap = {
  rootName: "urlset", namespace: "http://www.sitemaps.org/schemas/sitemap/0.9", parseError: false,
  urls: ROUTES.filter((route) => route.indexable).map(canonicalUrl),
};
const response = (body, contentType = "text/plain") => ({ status: 200, body, contentType });
const files = () => ({
  "llms.txt": assessDiscoveryDocument("llms.txt", response(renderLlms())),
  "robots.txt": assessDiscoveryDocument("robots.txt", response(renderRobots())),
  "sitemap.xml": assessDiscoveryDocument("sitemap.xml", { ...response(renderSitemap(), "application/xml"), sitemap }),
});

test("all maintained routes pass without meta keywords, including intentional noindex", () => {
  for (const route of ROUTES) {
    const report = buildDiagnosticReport(fixture(route), files());
    assert.equal(report.score, 100, route.path);
    assert.equal(report.checks.some((check) => /keyword/.test(check.id)), false);
  }
});

test("pending and failed discovery requests cannot claim a full pass", () => {
  assert.equal(buildDiagnosticReport(null).score, null);
  assert.equal(buildDiagnosticReport(fixture()).score, null);
  const evidence = files();
  evidence["llms.txt"] = { passed: false, detail: "HTTP 404" };
  assert.ok(buildDiagnosticReport(fixture(), evidence).score < 100);
  assert.equal(buildDiagnosticReport(fixture(), evidence).checks.find((check) => check.id === "llms.txt").passed, false);
});

test("missing social tags, malformed JSON-LD and wrong canonical lower the score", () => {
  for (const change of [
    { og: {} }, { twitter: {} }, { schemas: [] }, { schemaErrors: ["Invalid JSON"] },
    { canonical: `${SITE.origin}/?utm_source=test` }, { canonicalCount: 2 },
    { robots: "noindex, follow" }, { language: "" }, { title: "Stale title" },
  ]) {
    assert.ok(buildDiagnosticReport({ ...fixture(), ...change }, files()).score < 100, JSON.stringify(change));
  }
});

test("route changes require the new title, canonical and graph rather than stale home data", () => {
  const home = fixture();
  const route = ROUTES.find((item) => item.path === "/projects/tasafrica");
  assert.ok(buildDiagnosticReport({ ...home, path: route.path }, files()).score < 100);
  assert.equal(buildDiagnosticReport(fixture(route), files()).score, 100);
  assert.ok(schemaTypes(route.schema).includes("CreativeWork"));
  assert.ok(!schemaTypes(route.schema).includes("Person"));
});

test("discovery checks reject HTTP errors, HTML fallbacks, wrong MIME and stale contents", () => {
  for (const kind of ["llms.txt", "robots.txt", "sitemap.xml"]) {
    for (const result of [
      { status: 404, body: "missing" }, response("<html>SPA fallback</html>", "text/html"),
      response("<!doctype html><html></html>"), response("", "application/json"),
    ]) assert.equal(assessDiscoveryDocument(kind, result).passed, false);
  }
  assert.equal(assessDiscoveryDocument("llms.txt", response("# Portfolio\nNo maintained links")).passed, false);
  assert.equal(assessDiscoveryDocument("robots.txt", response("User-agent: *\nAllow: /\n")).passed, false);
  assert.equal(files()["robots.txt"].agentCount, 7);
  assert.equal(files()["sitemap.xml"].urlCount, 4);
});

test("sitemap validation rejects malformed, duplicate, missing and private URLs", () => {
  for (const change of [
    { parseError: true }, { namespace: "" }, { rootName: "html" }, { urls: [] },
    { urls: [...sitemap.urls, `${SITE.origin}/api/health`] },
    { urls: [...sitemap.urls.slice(1), sitemap.urls[1]] },
  ]) assert.equal(assessDiscoveryDocument("sitemap.xml", {
    ...response(renderSitemap(), "application/xml"), sitemap: { ...sitemap, ...change },
  }).passed, false);
});

test("network errors remain failures and cancelled requests do not produce success", async () => {
  const networkError = await fetchDiscoveryDocument("llms.txt", { fetchImpl: async () => { throw new Error("offline"); } });
  assert.equal(networkError.passed, false);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(fetchDiscoveryDocument("llms.txt", { signal: controller.signal,
    fetchImpl: async () => { throw new Error("aborted"); } }));
  let options;
  const live = await fetchDiscoveryDocument("llms.txt", { fetchImpl: async (url, requestOptions) => {
    assert.equal(url, "/llms.txt");
    options = requestOptions;
    return new Response(renderLlms(), { headers: { "content-type": "text/plain" } });
  } });
  assert.equal(live.passed, true);
  assert.equal(options.credentials, "omit");
  assert.equal(options.cache, "no-store");
});
