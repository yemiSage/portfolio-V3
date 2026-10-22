# Discoverability audit

Date: 2026-10-22  
Repository: `portfolio-V3`  
Canonical production origin: `https://yemii.vercel.app` (verified from the existing production metadata, sitemap and successful HTTP 200 responses from the deployed home and case-study routes).

## Architecture

- React 19 single-page application built with Vite 8.
- Express 5 development/production server plus Vercel TypeScript functions under `api/`.
- Client-side history routing in `src/App.jsx`; no router package.
- Public deployment configured by `vercel.json`.
- No database, tenant model, authenticated application area, commerce catalogue or CMS.
- Public content is maintained in React components and Markdown knowledge files.
- Internal application APIs power chat, transcription and GitHub statistics; they are not a documented public or partner API.

## Route classification

| Route | Classification | Indexing decision | Evidence |
| --- | --- | --- | --- |
| `/` | Public and indexable | Index | Portfolio home in `src/App.jsx` |
| `/projects/tasafrica` | Public and indexable | Index | Public case study component |
| `/projects/limestone` | Public and indexable | Index | Public case study component |
| `/projects/stayafrika` | Public and indexable | Index | Public case study component |
| `/resume` | Public but non-indexable action route | Noindex; canonical `/` | Client replaces the route with `/` and opens the PDF viewer |
| `/resume/opeyemi-adegboye-resume.pdf` | Static public download | Not listed in XML sitemap | Linked public resume asset |
| `/api/health` | Restricted/internal API endpoint | Noindex and robots exclusion | Express-only health response |
| `/api/github-stats` | Restricted/internal API endpoint | Noindex and robots exclusion | Client data endpoint |
| `/api/github-contributions` | Restricted/internal API endpoint | Noindex and robots exclusion | Client data endpoint |
| `/api/chat` | Restricted/internal API endpoint | Noindex and robots exclusion | Portfolio assistant backend |
| `/api/transcribe` | Restricted/internal API endpoint | Noindex and robots exclusion | Voice-input backend |
| `/robots.txt` | Public machine-readable endpoint | Crawlable | Generated crawler policy |
| `/sitemap.xml` | Public machine-readable endpoint | Crawlable | Generated canonical URL set |
| `/llms.txt` | Public machine-readable endpoint | Crawlable, not in sitemap | Supplementary AI-readable summary |
| `/assets/*` and public media | Static assets/downloads | Crawlable as referenced | Vite and `public/` output |
| Any other path | Not found | 404/noindex | Generated `404.html` and production server fallback |

## Capability matrix

| Area | Existing functionality | Gap or risk found | Required implementation | Applicability | Priority | Complexity | Status | Supporting evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rendered public content | SPA shell only | All routes returned the same empty `#root` HTML | Build-time route HTML snapshots | Applicable | Critical | Medium | Complete locally | `scripts/generate-discoverability.mjs` |
| Titles/descriptions | One global set | Duplicate metadata on every route | Central route registry and runtime synchronization | Applicable | High | Medium | Complete locally | `src/discoverability/site.js`, `src/utils/seo.js` |
| Canonicals | Missing | Query/domain duplication signal absent | Absolute route canonicals | Applicable | High | Low | Complete locally | Generated route HTML |
| Social previews | Global tags | Missing route URLs/titles/descriptions | Per-route OG and X metadata | Applicable | High | Low | Complete locally | Renderer and tests |
| Preview image | Existing 1200×630 JPEG | No automated dimension check | Reuse verified branded image and test dimensions | Applicable | Medium | Low | Complete locally | `public/og-design-engineer.jpg` |
| Structured data | Large global graph | Claims were broader than the visible route and duplicated across pages | Minimal Person/WebSite/ItemList and route CreativeWork/Breadcrumb graphs | Applicable | High | Medium | Complete locally | `src/discoverability/site.js` |
| Sitemap | Static six-entry file | Included non-indexable `/resume`, `llms.txt`, and guessed/stale dates | Generate only four canonical HTML pages | Applicable | High | Low | Complete locally | `public/sitemap.xml` |
| Robots policy | Explicitly allowed many crawlers | Did not exclude internal APIs or distinguish crawler purposes clearly | Generated policy with API exclusion and separate search/training sections | Applicable | High | Low | Complete locally | `public/robots.txt` |
| AI-readable summary | Existing promotional `llms.txt` | Relative links and recommendation-oriented copy | Factual absolute-link summary with explicit scope | Applicable | Medium | Low | Complete locally | `public/llms.txt` |
| Public API docs | No intentional public/partner API | Publishing internal assistant endpoints would expand exposure | Document out-of-scope decision | Out of project scope | N/A | N/A | Complete decision | `API_DISCOVERY.md` |
| MCP/agent server | No approved agent-facing operations or OAuth resource server | Adding tools would create a new product/security surface | Do not implement | Out of project scope | N/A | N/A | Complete decision | `MCP_IMPLEMENTATION.md` |
| Multi-tenancy/custom domains | No tenant model | No supporting architecture | Do not implement | Out of project scope | N/A | N/A | Complete decision | Repository architecture |
| E-commerce/local business/multilingual | Portfolio is not a catalogue, local storefront or translated site | Any generated pages or schema would be artificial | Do not implement | Out of project scope | N/A | N/A | Complete decision | Public content and routing |
| Analytics dashboard | No approved provider integration or authenticated data source | Metrics would be unsupported | Do not add tracking/dashboard | Out of project scope | N/A | N/A | Complete decision | No analytics dependency/configuration |
| API crawl protection | Robots only | Robots is not access control; health exposed configuration presence | Add `X-Robots-Tag`, `no-store`, remove key-presence detail | Applicable | High | Low | Complete locally | `server.ts`, `vercel.json` |
| Unknown routes | SPA rewrite returned 200 | Soft-404 risk | Explicit public rewrites and real 404 artifact | Applicable | High | Medium | Complete locally | `vercel.json`, `dist/404.html` |
| CI | No workflow | Discoverability regressions were not gated | Node tests plus build workflow | Applicable | High | Low | Complete locally | `.github/workflows/discoverability.yml` |
| Production verification | Existing deployment responds | New commit is not deployed | Deploy through approved workflow, then re-run provider checks | Applicable externally | High | External | Pending authorization/workflow | `PRODUCTION_READINESS.md` |

## Standards consulted

- Google Search Central: JavaScript SEO, sitemaps, robots and structured-data guidance.
- Bing Webmaster Guidelines: crawlable HTML, canonical sitemap entries and the distinction between crawling and indexing.
- OpenAI publisher guidance: `OAI-SearchBot` controls search discovery separately from `GPTBot` model-training controls.

No implementation guarantees crawling, indexing, rankings, rich results, AI citations or social-platform discovery.
