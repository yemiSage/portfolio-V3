# Social discoverability

## Implemented

Every shareable canonical route receives:

- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name` and `og:locale`.
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` and image alternative text.
- A matching canonical URL.

The existing branded `public/og-design-engineer.jpg` is reused. Automated inspection confirms it is a 1200×630 JPEG.

## Decisions

- One stable branded preview is appropriate for the current four-page portfolio. Dynamic image generation would add runtime complexity without a publishing workflow or route-specific art direction.
- Verified profile links are included only where already published by the portfolio.
- No social publishing API, platform automation, caption CMS or UTM campaign system was added because no approved workflow, credentials or campaign model exists.
- Website metadata supports link previews but does not guarantee discovery or distribution inside Instagram, TikTok, LinkedIn, X, Pinterest or messaging applications.

## Post-deployment checks

Refresh each canonical route with the platforms' official preview debuggers when access is available. Confirm the deployed image is public and that caches have refreshed before evaluating a failed preview.
