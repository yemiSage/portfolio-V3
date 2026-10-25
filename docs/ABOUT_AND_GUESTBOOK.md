> Updated 2026-10-25: New valid submissions now publish immediately (HTTP 201) and are inserted into the visible wall after a successful save. The form is in a native modal opened above the guidelines. Existing pending notes remain private until an explicit owner decision; no automatic migration publishes them. Previous review-before-publication descriptions below are historical. Both storage adapters retain the latest 100 published notes, with existing origin, validation, honeypot and cooldown controls preserved.

# About and Guestbook

## Pages and visual direction

- `/about`: a personal introduction, engineering-to-design timeline, approach, interests, and invitation to the guestbook. Biography and original photographs come from the owner's https://yemi.framer.website/about page, with present-day role and product context from this repository. Older claims about current job availability, language proficiency, or achievement counts were not invented or refreshed without evidence.
- `/guestbook`: a short note composer, five paper colors, a wall of approved visitor notes, and a clearly labeled invitation from the host. No fabricated visitor notes or counts.
- Reuses Bricolage Grotesque, Inter, white/charcoal, the existing orange accent, ASCII portrait, footer, and section-navigation component. Uses inline photo capsules as a composition idea from https://www.oyin.design/, a visitor-note concept from https://www.uxderrick.com/guestbook, and a section index inspired by https://www.anushriya.com/about. It does not copy their layouts, graphics, biography, or visitor content.
- The index sits on the right on desktop and uses the existing case-study **Jump to** menu below the header at widths below 768px. Photos open in a native dialog with Escape and focus restoration. Reduced-motion preferences disable decorative transitions.
- `SiteHeader` provides the same mobile ASCII portrait, Contact Me control, menu, and menu entries on home, About, Guestbook, and case studies. `ProfileLinks` shares the desktop yemiLLM/About/Resume links without changing the established home sidebar. Contact actions reuse `.button.button-primary`; body copy uses existing typography tokens. About's mobile contact heading is 32px and its off-clock paragraph is 20px; the two contact actions are centered in one wrapper.

## Routing and discovery

Both routes are lazy-loaded within the existing React app and explicitly routed by Express and Vercel. They receive unique metadata, production canonicals, Open Graph/X tags, structured data, static crawlable introductions, sitemap entries, and llms.txt links through the established discovery generator. Guestbook submissions and the review queue are never embedded into generated HTML, structured data, or machine-readable discovery files. `/api/guestbook` is an internal UI endpoint, not a newly advertised partner API or agent interface.

## Review before publication

The owner selected **review before publishing**. POST creates a pending note and returns HTTP 202. GET returns only published notes. Approval and rejection happen from a trusted owner terminal. There is no public moderation endpoint or new authentication system.

Development uses `.data/guestbook.json`, excluded from Git. Writes are serialized and replaced atomically. This is deliberately limited to local development, not used as serverless persistence. In production, the adapter uses the official Upstash Redis REST API (https://upstash.com/docs/redis/features/restapi).

Set these **server-side** environment variables for the Vercel environment that should receive notes:

```dotenv
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-server-side-token
```

No cloud database has been provisioned by this change. Configure an owner-controlled database and redeploy the selected environment before production submission can work. Never prefix these values with `VITE_`, place real credentials in `.env.example`, or share them in browser code. Use a separate database for previews if preview notes should not mix with production.

Without storage credentials, production returns `canSubmit: false`, disables submission, and offers the public email link. It never claims to save a note into ephemeral serverless files.

From a trusted terminal with the target database variables loaded:

```powershell
node --env-file-if-exists=.env.local scripts/moderate-guestbook.mjs list
node --env-file-if-exists=.env.local scripts/moderate-guestbook.mjs approve <note-id>
node --env-file-if-exists=.env.local scripts/moderate-guestbook.mjs reject <note-id>
```

When Redis variables are absent, these commands use the local development file. Always confirm the intended environment before moderating. Approval publishes the note on the next page load. Rejection deletes that pending note. Only the latest 100 approved cloud notes are returned and retained in the published list; pending queue is limited to 500. There is no authenticated owner dashboard in this scope.

## Security and privacy

- JSON bodies capped at 4KB; names at 40 characters; notes at 180. Only known paper colors are accepted.
- Exact allowed write origins: the maintained production origin, the current Vercel deployment URL, and localhost in development. Missing or unrelated origins are rejected. Origin checks are an abuse/CSRF boundary, not proof of visitor identity.
- One submission per IP-derived keyed hash per minute. Redis submission/cooldown/queue limits are atomic via EVAL. Raw IPs are not stored in notes. Local development uses a local hash and process-serialized file writes.
- Honeypot field, link/email rejection, bounded pending queue, and owner review. These controls reduce abuse; they do not guarantee a spam-free service. Hosting WAF and database quotas remain external configuration.
- Only submitted name, message, paper color, UUID, and timestamp are persisted. The form explains that the name/note will become public only after review. React renders note text as text; it is never injected as HTML.
- API responses are no-store and noindex. Tokens remain server-side. Storage failures return bounded messages, not provider details or credentials.
- No analytics, social publishing, tracking consent changes, credentials, or external provider configuration were added.

## Validation

`npm test` includes real temporary-file tests for persistence, moderation visibility, approval/rejection, cooldown, malicious origins, malformed or oversized payloads, link/email validation, missing production storage, and safe error handling. The Redis adapter follows the provider's documented command interface; a real cloud database cannot be verified until credentials exist.

Run `npm run build` for static page and server compilation. Browser verification covers both routes, photo dialog and Escape/focus restoration, section navigation, mobile menu, note composition and a local pending submission. Any QA note is rejected afterward; test visitor messages are not seeded into the public wall.
