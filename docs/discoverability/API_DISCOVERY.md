# API discovery decision

Status: **Out of project scope; no public OpenAPI document or API explorer implemented.**

## Repository evidence

The routes under `/api/` exist to support the portfolio interface:

- chat and transcription;
- GitHub statistics and contribution data;
- a minimal health check.

They do not form an intentional public or partner API, have no external versioning contract and include operations that depend on server-side provider credentials.

## Implemented protection

- `/api/` is excluded from crawler access in `robots.txt`.
- Vercel and Express responses set `X-Robots-Tag: noindex, nofollow, noarchive` and `Cache-Control: no-store`.
- The health endpoint no longer reveals whether AI-provider keys are configured.

## Requirements for reconsideration

A future public API requires an explicit consumer and support policy, stable versioning, authentication/authorization design, rate limits, schemas, error contracts, privacy review and separate public documentation. Internal handlers must not be published merely to satisfy a discoverability checklist.
