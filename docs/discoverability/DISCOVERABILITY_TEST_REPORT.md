# Discoverability test report

Date: 2026-10-22

## Automated tests

Command: `npm test`

Result after the inspector correction: **14 passed, 0 failed** (7 original discoverability tests plus 7 diagnostic regression tests).

Coverage:

1. Unique public paths, titles and descriptions.
2. Absolute canonical URLs.
3. Crawlable route HTML with required metadata.
4. Parseable route JSON-LD.
5. Sitemap inclusion/exclusion behavior.
6. Robots search/training sections and API exclusion.
7. `llms.txt` route coverage and explicit API/MCP scope.
8. 1200×630 JPEG preview dimensions.
9. Vercel prerendered-route and API noindex configuration.

## Production build

Command: `npm run build`

Result: **Passed**. Vite built the client, the generator emitted route HTML and machine-readable files, and esbuild produced `dist/server.cjs`.

The build emitted existing third-party Rolldown warnings about `"use client"` directives in Framer Motion and Lucide modules. These warnings did not fail the build and were not introduced by discoverability logic.

## Generated-output inspection

Verified locally:

- `dist/index.html` and three case-study route files exist.
- Each indexable route has a distinct title, description, canonical and crawlable `<h1>`.
- `dist/resume/index.html` is `noindex`.
- `dist/404.html` is `noindex`.
- `sitemap.xml` contains four canonical public pages and excludes APIs, `/resume` and `llms.txt`.

## Browser smoke checks

Headless Chromium loaded the home page and all three case studies at 375×812 and 1440×900. All eight checks returned HTTP 200 with the expected runtime title and canonical URL. No JavaScript page errors, failed images or horizontal document overflow were detected. This is a responsive smoke check, not a field Core Web Vitals measurement or a complete WCAG conformance audit.

## Inspector regression verification

`tests/diagnostics.test.mjs` checks all maintained routes without meta keywords, deliberate noindex, pending/failed requests, missing social tags, broken JSON-LD, wrong or duplicate canonical URLs, stale route data, HTTP errors, HTML fallbacks, incorrect MIME types, stale/malformed/private sitemap entries, network failures and cancellation. The normal `npm test` command includes these checks in CI.

`scripts/check-diagnostic-browser.mjs` is an optional Playwright smoke test requiring an available Playwright installation and Chrome. Configure `PLAYWRIGHT_MODULE_PATH` with the absolute path to `playwright/index.mjs` when Playwright is supplied externally; `DIAGNOSTIC_TEST_ORIGIN` defaults to `http://localhost:3000`.

Verified at 1304×884 and 375×812 against development at localhost:3000 and the local production build at localhost:3001: 11/11 live checks pass, the displayed technical score is 100/100, missing Open Graph and invalid JSON-LD lower the score, restoration recovers it, an HTML discovery fallback fails, local keyword notes never change metadata or score, navigation/back refreshes metadata, Escape closes the dialog, and there are no JavaScript page errors or horizontal overflow. All seven footer links compute to 14px at both viewport sizes; the shared footer rule applies across breakpoints and case-study footers.

## External checks still pending

- Production deployment or production logs.
- Search Console/Bing index coverage or sitemap submission.
- Social platform cache refreshes.
- Field Core Web Vitals.
- AI citations or referral traffic.
- Provider-side CDN/WAF crawler rules.

These require deployment and provider access. They are not represented as failures of deterministic local tests.
