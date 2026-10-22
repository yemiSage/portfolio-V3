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

## Inspector scoring correction

The optional inspector now defaults to Page Checks and scores actual title/description agreement with the route registry, canonical URL, indexing directive, language, Open Graph, X Card and JSON-LD syntax/expected types, plus current-origin responses from the three discovery files. It observes document-head changes and rereads on open; requests time out after 10 seconds, are aborted on cleanup, and are never assumed successful.

An absent meta-keywords tag is not a failure. Keyword notes remain editable as browser-local writing notes using the existing storage key, without altering metadata or publishing changes. Hardcoded title, crawler, sitemap, skill and project counts have been removed. The former Apply to Live Page control is now Run Checks Again.

The score is not a Lighthouse, rankings, GEO citation or indexing metric. JSON-LD checks cover syntax and expected types, not complete Schema.org validation. robots.txt checks verify response structure and the canonical sitemap reference, not every crawler policy or CDN/WAF permission. Social checks verify tag values, not image delivery. Sitemap results describe URLs listed, never indexed pages.

References: [Google supported meta tags](https://developers.google.com/search/docs/crawling-indexing/special-tags), [React effect lifecycle](https://react.dev/reference/react/useEffect), [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

## Standards basis

The implementation follows current Google guidance favoring static/server rendering for JavaScript content, canonical-only sitemap entries, and accurate visible-page structured data. It also follows Bing guidance that robots controls crawling rather than authorization or guaranteed indexing.
