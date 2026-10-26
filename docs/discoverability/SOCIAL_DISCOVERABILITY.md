# Social discoverability

## Implemented

Every shareable canonical route receives:

- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name` and `og:locale`.
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` and image alternative text.
- A matching canonical URL.

Each of the seven maintained routes has its own static 1200×630 JPEG in `public/social/`, selected by `image` and `imageAlt` in `src/discoverability/site.js`. Runtime metadata and build-generated HTML use the same values. Case-study structured data uses the corresponding image.

## Decisions

- Static route-specific images require no image-generation service or credentials. Regenerate them on Windows from the repository root with `./scripts/generate-social-previews.ps1` and commit the outputs. The script reads the maintained route data.
- Guestbook is shareable at the canonical public `/guestbook` URL with its own preview. The visible Share button was removed at the owner's request; direct link sharing remains supported.
- Open Graph image fields follow https://ogp.me/. Preview delivery on social platforms remains subject to their caches and fetch behavior.
- Verified profile links are included only where already published by the portfolio.
- No social publishing API, platform automation, caption CMS or UTM campaign system was added because no approved workflow, credentials or campaign model exists.
- Website metadata supports link previews but does not guarantee discovery or distribution inside Instagram, TikTok, LinkedIn, X, Pinterest or messaging applications.

## Post-deployment checks

Refresh each canonical route with the platforms' official preview debuggers when access is available. Confirm the deployed image is public and that caches have refreshed before evaluating a failed preview.
