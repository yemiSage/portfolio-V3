# Discoverability handover

## Applicable phases completed locally

- Repository and route audit.
- Technical SEO foundation.
- AI-readable public content and `llms.txt`.
- Social sharing metadata.
- Mobile-safe preservation of the existing React UI.
- Deterministic tests and CI workflow.
- Security and production-readiness documentation.

## Out-of-scope decisions

- Public API/OpenAPI: internal UI endpoints are not a supported public contract.
- MCP/agent connectivity: no approved agent operations or OAuth resource server exists.
- Multi-tenancy/custom domains: no supporting architecture.
- E-commerce/product feeds: portfolio is not a catalogue.
- Local-business/location SEO: no verified storefront/service-area content model.
- Multilingual/hreflang: no translated route equivalents.
- Analytics dashboard: no approved provider data or operational dashboard requirement.
- Social publishing: no approved credentials, scopes or content workflow.
- TSES package release: no second compatible consumer or package lifecycle exists.

## Files and modules

- Route source and generators: `src/discoverability/`, `scripts/generate-discoverability.mjs`.
- Runtime synchronization: `src/utils/seo.js`, `src/App.jsx`.
- Initial HTML and generated public files: `index.html`, `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`.
- Production routing/security: `vercel.json`, `server.ts`.
- Tests and CI: `tests/discoverability.test.mjs`, `.github/workflows/discoverability.yml`.
- Documentation: `docs/discoverability/`.

## Verification summary

- `npm test`: 14 passed, 0 failed, including the inspector regression suite.
- `npm run build`: passed.
- Headless Chromium: 8 mobile/desktop route checks passed with no page errors, failed images or horizontal overflow.
- Preview image: verified 1200×630 JPEG.
- Inspector: live 11-condition score, response verification and failure/recovery browser checks passed at desktop/mobile sizes. This score does not measure indexing or AI citations.
- Footer: all seven links use the shared 14px style across responsive breakpoints.
- Production: not deployed in this work.
- Search/provider indexing: not claimed.

## Maintenance workflow

1. Update `src/discoverability/site.js` when adding or renaming a public route.
2. Keep fallback summaries consistent with visible React content.
3. Run `npm test` and `npm run build`.
4. Review generated public files and all route HTML.
5. Deploy through the approved workflow and complete the checks in `PRODUCTION_READINESS.md`.

## Recommended next improvements

1. Collect authorized field Core Web Vitals after deployment and optimize the measured bottlenecks.
2. Add browser accessibility checks when the project adopts a browser-test runner.
3. Pilot a report-only Content Security Policy before enforcement.
4. Add route-specific social artwork only if a maintainable art-direction workflow is established.
5. Revisit API or MCP only after an explicit product and authorization decision.
