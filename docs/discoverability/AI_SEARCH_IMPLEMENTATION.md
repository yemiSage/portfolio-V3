# AI search implementation

## Implemented

- Public pages now return concise, factual route-specific content in the initial HTML response.
- Entity names, descriptions, canonical URLs and case-study summaries are shared across metadata, JSON-LD, the sitemap and `llms.txt`.
- `llms.txt` uses absolute canonical links and lists only maintained public content.
- `OAI-SearchBot`, Googlebot, Bingbot and PerplexityBot are allowed to crawl public content while internal APIs are excluded.
- Search/answer crawling is described separately from model-training crawler policy.

## Policy

The existing site allowed training crawlers. This implementation preserves that policy for `GPTBot` and `Google-Extended` while making the distinction explicit. Changing the training policy is a product-owner decision, not a ranking optimization.

## Limitations

- `llms.txt` is supplementary and does not guarantee AI ingestion or citation.
- Crawler user-agent strings are not treated as authentication.
- No WAF or CDN control plane is represented in this repository, so live bot rules require deployment-provider review.
- No AI referral metric is claimed because no approved analytics provider data was available.
- `llms-full.txt` was not added because it would duplicate the existing public pages and Markdown sources without a clear maintenance benefit.

## External verification pending

After deployment, verify public 200 responses and bot accessibility at the CDN/WAF layer. Use provider tools or logs when authorized; do not infer citation eligibility from a local test.
