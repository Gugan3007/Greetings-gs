# Public Greeting Sharing and Letter-Rain Design

## Goal

Make every generated greeting available through a durable HTTPS link that opens on any phone or network, preserves uploaded media, and remains available after development or deployment restarts. Replace the current word-train entrance with an expressive letter-rain animation that assembles the signature sentence on scroll.

## Public sharing architecture

Supabase becomes the durable source of truth and Vercel hosts the Next.js application. The browser never receives database credentials with elevated access.

- A server-only Supabase admin client uses the current `SUPABASE_SECRET_KEY` inside API routes.
- The `greetings` table stores the slug, authored JSON content, ownership token hash, publication status, and timestamps.
- `/api/generate` authors the greeting, persists it, and returns only the slug, owner token, and canonical HTTPS share URL.
- `/api/greetings/[slug]` reads published content from Supabase. The in-memory store remains only as a development acceleration path, not as the durable source.
- `NEXT_PUBLIC_SITE_URL` supplies the deployed origin, so copied links never contain `localhost` or a private LAN address in production.
- The owner token remains in the sender browser and controls sender-preview affordances. Recipients receive only published greeting content.

## Media flow

Large image data must not be copied through session storage or embedded permanently as data URIs.

1. The browser requests a short-lived signed upload permission from a server route.
2. Each selected image uploads directly to a Supabase Storage bucket using a random, unguessable object path.
3. The form stores the resulting public media URL instead of base64 data.
4. Generation and greeting records reference those URLs.
5. Upload validation limits file type, file size, and image count before network work begins.

The greeting media bucket is public because recipients open greetings without authentication. Object paths are random and are never derived from recipient names.

## Letter-rain interaction

The signature sentence remains semantic text for screen readers. Visually, each character is rendered as an animated span.

- Characters begin above the sentence at varied vertical distances with small horizontal drift and rotation.
- On first scroll entry, letters fall in a controlled stagger, decelerate, and settle into their exact inline positions.
- Spaces retain natural wrapping, so the final sentence remains centered on mobile and desktop.
- A subtle glow appears as letters land; no continuous animation runs afterward.
- With `prefers-reduced-motion`, the complete sentence renders immediately with no hidden intermediate state.
- Animation uses transform and opacity only to avoid layout thrashing and Safari lag.

## Failure handling

- Generation is considered successful only after the database insert succeeds.
- Database or upload failures return a clear retryable message; the UI does not claim completion early.
- If an individual image upload fails, it can be retried without losing the rest of the form.
- Missing or unpublished slugs return a friendly unavailable page with a create-new action.
- Local development may use the current memory fallback, but the share modal labels local-only links and never presents them as globally available.

## Verification

- Generate a greeting with a multi-megabyte image and confirm browser handoff storage stays small.
- Restart the application and confirm the same slug still loads from Supabase.
- Open the HTTPS URL in a clean mobile browser with no session data and on a different network.
- Confirm the copied URL uses the deployed domain.
- Verify sender-preview controls do not appear for the recipient.
- Check the letter animation before entry, while falling, and after settlement at desktop and 390px mobile widths.
- Verify reduced-motion, Safari, no horizontal overflow, lint, type checking, and production build.

## Deployment requirements

The deployment needs a Supabase project and Vercel project with these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `GOOGLE_GEMINI_API_KEY` when live AI generation is desired

Secrets are configured in the hosting platforms and never committed to Git.
