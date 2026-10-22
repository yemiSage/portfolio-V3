# SEO implementation

## Implemented

- Build-time crawlable HTML for `/` and the three case studies.
- Unique titles, descriptions, canonical URLs, robots directives, Open Graph and X Card fields.
- Runtime metadata synchronization after history navigation.
- Minimal truthful JSON-LD:
  - Home: `Person`, `WebSite`, `ItemList`.
  - Case studies: `CreativeWork`, `BreadcrumbList`.
- Generated XML sitemap containing only canonical indexable HTML routes.
- Generated robots policy that excludes internal `/api/` paths from crawling.
- Real production 404 output instead of returning the home page for unknown URLs.
- `noindex` handling for the resume action route and API response headers.

## Deliberately omitted

- `hreflang`: no translated route equivalents exist.
- Product, Offer, Review, LocalBusiness, FAQ, Article and Video rich-result markup: the current pages do not satisfy a clear, maintained content model for these types.
- Sitemap `lastmod`: no trustworthy per-route publishing timestamp is maintained. Guessed dates were removed.
- Specialized image/video sitemap: the four-page portfolio does not need one, and the media is already discoverable from HTML.
- Search submission: requires provider ownership/access and does not guarantee indexing.

## Maintenance

Add or change a public route in `src/discoverability/site.js`. Run `npm test` and `npm run build`; do not hand-edit generated `robots.txt`, `sitemap.xml` or `llms.txt` without updating the renderer.

## Standards basis

The implementation follows current Google guidance favoring static/server rendering for JavaScript content, canonical-only sitemap entries, and accurate visible-page structured data. It also follows Bing guidance that robots controls crawling rather than authorization or guaranteed indexing.
