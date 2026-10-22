# Security review

## Findings addressed

| Finding | Risk | Resolution |
| --- | --- | --- |
| API health disclosed credential-presence state | Reveals deployment configuration signal | Removed `assistant` and `hasApiKey`; response now reports only health |
| API routes were crawlable under a global allow policy | Internal endpoints could be discovered or cached | Added `/api/` robots exclusion and `X-Robots-Tag`/`no-store` headers |
| Catch-all production rewrite returned the home page for unknown paths | Soft 404s and misleading crawl results | Replaced with explicit public-route rewrites and generated 404 output |
| Global structured data contained broad route-independent claims | Search systems could associate unsupported statements with every route | Replaced with minimal route-specific graphs tied to visible content |

## Existing boundaries preserved

- Provider keys remain server-side and are not emitted into generated files.
- Chat, transcription and GitHub integrations were not converted into public APIs.
- No authentication, authorization or rate-limit control was weakened.
- No MCP tools, OAuth endpoints, tenant identifiers or speculative agent resources were created.
- No user data, private content, secrets or internal schemas were added to `llms.txt`, sitemap or JSON-LD.

## Deployment headers

Vercel adds `nosniff`, strict-origin referrer policy and a conservative permissions policy. A Content Security Policy was not introduced in this pass because the application embeds external links/media and uses runtime integrations; deploying an untested CSP could break established behavior. CSP hardening should begin in report-only mode with production telemetry.

## Residual risks

- Robots directives are advisory and do not secure endpoints.
- Application endpoints still require their existing server-side abuse protections and provider quotas.
- CDN/WAF bot policies are outside repository visibility and require authorized provider review.
- The existing public resume and contact information remain intentionally public.
- Dependency and secret scanning should continue in the deployment platform; this local pass did not prove the absence of provider-side configuration issues.
