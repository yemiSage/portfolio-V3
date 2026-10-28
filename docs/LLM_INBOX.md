# yemiLLM private inbox

Visit `/me/LLM` on the portfolio domain and enter the owner access key. The inbox shows the latest 500 exchanges from the last 90 days, with questions, answers, page paths, timestamps, and response source. Search locally or use Refresh for new exchanges. Reloading or Lock inbox removes the access key from the page's memory.

## Production setup

In Vercel project environment settings, set `LLM_INBOX_KEY` to a password or random value of at least 12 characters. Generate one with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` and keep it in your password manager. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or the existing `KV_REST_API_URL` and `KV_REST_API_TOKEN`). Existing guestbook Redis credentials can be reused; inbox data has its own key. Redeploy after setting environment variables.

Until both authentication and durable storage are configured, production collection is disabled and the inbox explains the missing setup. Past questions cannot be recovered. Local development uses `.data/llm-inbox.json` when an access key is configured in `.env.local`; restart `npm run dev` after editing environment variables.

## Data and access

The API authenticates every read on the server with a constant-time comparison. Ten failed login attempts lock that network out for 15 minutes; production uses Redis to share limits between instances. Login limits use a temporary hash of the network address, separate from conversations. The access key is never compiled into the website or put in URLs or browser storage. The private page and API send noindex and no-store headers; the inbox is excluded from the sitemap and public navigation. Conversations render as plain text. Only each new question and answer is recorded; IP addresses, identity, extracted page contents, and entire submitted histories are not stored. Redis keeps at most 500 entries; entries older than 90 days are excluded from reads, and the inbox key expires after 90 days without writes. Storage errors do not break chat replies.

The chat includes a visible notice that conversations may be saved for Yemi to review. Suggested follow-up requests and rejected chat requests are excluded. Responses interrupted during generation can be marked partial; exchanges interrupted before the server begins responding may not be saved.
