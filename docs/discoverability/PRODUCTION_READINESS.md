# Production readiness

## Local status

The implementation is locally buildable and the deterministic discoverability suite passes. Production deployment has **not** been performed or claimed.

## Ready for deployment

- Crawlable route-specific HTML.
- Unique metadata, canonical URLs and truthful JSON-LD.
- Generated sitemap, robots policy and `llms.txt`.
- Social preview metadata using a verified 1200×630 image.
- Explicit Vercel route rewrites and API noindex/security headers.
- Real 404 output.
- GitHub Actions test/build workflow.

## Deployment checklist

1. Review and approve the complete diff.
2. Run `npm ci`, `npm test` and `npm run build` in CI.
3. Deploy through the existing approved Vercel/Git workflow.
4. Request each canonical URL and confirm status, title, canonical and visible initial HTML.
5. Confirm unknown URLs return 404.
6. Confirm `/api/*` responses include `X-Robots-Tag` and `Cache-Control: no-store`.
7. Confirm `robots.txt`, `sitemap.xml`, `llms.txt` and the preview image return 200.
8. Validate JSON-LD with Schema.org tooling and Google tooling where a supported result applies.
9. Refresh social preview caches using official platform tools.
10. Review CDN/WAF logs for accidental crawler blocking.

## External actions still required

- Google Search Console and Bing Webmaster Tools access for ownership verification, URL inspection and sitemap submission.
- Deployment authorization/workflow execution.
- Provider access for production logs and field performance data.

Sitemap submission is a discovery hint, not proof of indexing. Indexing and rich-result status must be reported only from provider evidence.
