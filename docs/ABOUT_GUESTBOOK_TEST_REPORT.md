# About and Guestbook verification

Date: 2026-10-25. Branch: `feat/about-guestbook`.

## Automated checks

- `npm test`: **20 passed, 0 failed**. Existing metadata, JSON-LD, sitemap, crawler policy, social image, diagnostics, and routing tests pass for the expanded route set. Six guestbook tests cover pending isolation, persistent local writes, approval/rejection, cooldown, denied origins, honeypot, field/size limits, missing production storage, restricted methods, and safe errors.
- `npm run build`: passed. Vite and the bundled Express server compile. Existing dependency warnings about `use client` directives remain informational.
- `git diff --check`: passed.
- No separate lint or TypeScript-check command is configured in this repository; those checks are not claimed.

## Browser and HTTP checks

- About and Guestbook checked at 320, 360, 666, 1024 and 1440 CSS pixels. No document horizontal overflow. One h1 per new page.
- Desktop right-hand section index; mobile Jump to menu opens, selects a section, updates the hash, and closes.
- Shared 72px mobile header checked on home, About, and StayAfrika case study: same ASCII portrait, Contact Me action, and menu control. Mobile menu contains yemiLLM, About, Guestbook, Resume; opening focuses its first control.
- Inline photo opens a native dialog; Escape closes it and focus returns to the invoking button.
- Mobile invitation heading computes to 32px; off-clock story to 20px. Contact actions use the normal button classes and a centered wrapper.
- Local browser submission returned the pending-review confirmation and did not appear in public notes. The QA submission was rejected/deleted afterward; review queue verified empty. Approval/published visibility and persistence tested using separate temporary test stores.
- Final browser checks showed no JavaScript console errors on the new page.
- Locally built production server: `/about`, `/guestbook`, `/sitemap.xml`, `/llms.txt`, `/api/guestbook` return HTTP 200. Page canonicals are `https://yemii.vercel.app/about` and `https://yemii.vercel.app/guestbook`.
- Production mode without storage credentials returns `notes: []`, `canSubmit: false`. No ephemeral production persistence is used.

## Boundaries and dependencies

- These are local measurements and checks, not claims about field Core Web Vitals, indexing, rankings, rich results, or production analytics.
- No live Redis database, hosted moderation, ownership verification, or authenticated provider settings were configured or verified. Storage requires owner-controlled Upstash REST URL/token on the selected deployment environment. Hosting WAF/quotas remain provider configuration.
- Both new pages and moderation behavior are implemented. Production note submission remains disabled until storage is configured; no visitor data or fabricated notes were published by these checks.
- No merge to `main` is authorized for this feature. Push only the feature branch.
