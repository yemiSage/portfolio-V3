# Discoverability architecture

## Decision

Keep the React/Vite product architecture and add a small framework-neutral discoverability layer rather than migrating to another framework.

## Components

1. `src/discoverability/site.js` is the maintained source of truth for the production origin, public route metadata, indexability, fallback content and truthful JSON-LD.
2. `src/discoverability/render.js` converts that source into HTML head tags, crawlable body content, `robots.txt`, `sitemap.xml` and `llms.txt`.
3. `scripts/generate-discoverability.mjs` writes source machine files before Vite runs and produces route-specific `dist/**/index.html` files after the client build.
4. `src/utils/seo.js` synchronizes title, canonical, robots, Open Graph, X Card and JSON-LD tags during client-side navigation.
5. `vercel.json` routes only known client routes to their generated HTML files. Unknown routes are no longer rewritten to the home shell.
6. `server.ts` serves the same generated route files in production mode and returns `404.html` for unknown paths.
7. `tests/discoverability.test.mjs` enforces the route registry, output metadata, sitemap exclusions, robots policy, AI file scope, preview dimensions and Vercel routing.
8. `src/discoverability/diagnostics.js` reads live document metadata and assesses current-origin discovery responses for the optional inspector. The score measures only its listed technical checks; pending requests have no numeric score. `tests/diagnostics.test.mjs` covers failures as well as passing routes.

## Rendering sequence

```text
route registry
  ├─ public robots/sitemap/llms files
  ├─ Vite client build
  ├─ prerendered route HTML and 404 HTML
  └─ runtime metadata updates after SPA navigation
```

The initial HTTP response contains meaningful headings, summaries and crawlable links. React replaces this initial content when the application starts, preserving the established UI and interaction model.

## Canonical policy

- `https://yemii.vercel.app` is the verified production origin used by existing deployed assets and successful live HTTP responses.
- Four HTML routes are canonical and indexable.
- `/resume` is an action/deep-link route, so it is `noindex` and canonicalizes to `/`.
- Query parameters never enter canonical URLs.
- Internal APIs and unknown paths are excluded from indexing.

## Why no reusable TSES package

Only one repository is in scope, and no second consumer or package-release workflow exists. Extracting a versioned package now would create speculative coupling. The pure route and rendering modules are intentionally separable and can become a package when another application demonstrates compatible requirements.
