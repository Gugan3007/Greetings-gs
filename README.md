# GS Greetings AI

GS Greetings AI turns personal notes, memories, and preferences into an authored, animated greeting website with a durable public share link.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Without Supabase variables, greetings use an intentionally temporary in-memory development fallback and photos use local previews.

## Required production services

The public sharing flow uses:

- Vercel for the Next.js application and canonical HTTPS URL.
- Supabase Postgres for durable greeting records.
- Supabase Storage for public greeting images uploaded through short-lived signed upload tokens.
- Google Gemini when `GOOGLE_GEMINI_API_KEY` is configured; otherwise the local authored fallback is used.

Copy `.env.example` to `.env.local` and provide:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server only; never expose or commit it)
- `NEXT_PUBLIC_SITE_URL` (the final HTTPS deployment origin)
- `GOOGLE_GEMINI_API_KEY` for live AI generation

Supabase now recommends publishable and secret keys for new projects. The secret client is isolated in `src/lib/supabase/admin.ts` and cannot be imported into browser components.

## Database and Storage

Authenticate and link the Supabase CLI, then apply the committed migration:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
npx supabase migration list
```

The migration creates an RLS-enabled `public.greetings` table with no browser-role privileges and a public-by-link `greeting-media` bucket restricted to supported image types and 10 MiB per object.

## Verification

```bash
npm test
npm run lint
npm run build
```

For end-to-end sharing, create a greeting in the deployed app, copy its HTTPS link, and open it in a clean browser or phone on a different network. The greeting must remain accessible after a deployment restart.

## Deployment

```bash
npx vercel login
npx vercel link
npx vercel --prod
```

Configure all production environment variables in Vercel. After obtaining the production domain, set `NEXT_PUBLIC_SITE_URL` to that HTTPS origin and redeploy so every copied greeting link uses the public domain.
