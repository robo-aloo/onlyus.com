# Only Us

This repository hosts the app in `onlyus.html` and includes a Cloudflare Pages Function endpoint for signaling.

## Cloudflare deployment (working setup)

1. Push this repository to GitHub/GitLab.
2. In Cloudflare Dashboard, go to **Workers & Pages → Create application → Pages → Connect to Git** and select this repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. Create a KV namespace (for signaling data), then bind it to your Pages project:
   - **Binding name:** `ONLYUS_SIGNAL`
5. Deploy.

## Runtime routes

- `/` → redirects to `onlyus.html` (via `index.html`)
- `/api/signal` → Cloudflare Pages Function (`functions/api/signal.js`)

`onlyus.html` uses `/api/signal` by default, so you do **not** need to hardcode a Worker URL anymore.

### Optional endpoint override

You can override the signaling endpoint with a URL query parameter:

- `https://your-domain.example/onlyus.html?cf=https://your-worker.workers.dev`

This is useful if you want to run signaling on a separate Worker domain.
