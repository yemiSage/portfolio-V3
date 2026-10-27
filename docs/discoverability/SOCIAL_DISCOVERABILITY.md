# Social discoverability

## Implemented

Every shareable canonical route receives:

- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name` and `og:locale`.
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` and image alternative text.
- A matching canonical URL.

All seven maintained routes share the homepage 1200×630 JPEG, `public/social/home.jpg`, and its alternative text. Each page retains its own title, description and canonical URL. Runtime metadata, the HTML fallback, build-generated HTML and case-study structured data use the shared image.

## Decisions

- The shared static image requires no image-generation service or credentials. Regenerate it on Windows from the repository root with `./scripts/generate-social-previews.ps1`. The script writes the asset once from homepage content so another route cannot overwrite the homepage design.
- Guestbook is shareable at the canonical public `/guestbook` URL with the shared homepage image and its own description. The visible Share button was removed at the owner's request; direct link sharing remains supported.
- Open Graph image fields follow https://ogp.me/. Preview delivery on social platforms remains subject to their caches and fetch behavior.
- Verified profile links are included only where already published by the portfolio.
- No social publishing API, platform automation, caption CMS or UTM campaign system was added because no approved workflow, credentials or campaign model exists.
- Website metadata supports link previews but does not guarantee discovery or distribution inside Instagram, TikTok, LinkedIn, X, Pinterest or messaging applications.

## Post-deployment checks

Refresh each canonical route with the platforms' official preview debuggers when access is available. Confirm the deployed image is public and that caches have refreshed before evaluating a failed preview.
