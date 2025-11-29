Supabase-ready, DaisyUI-styled calendar + notes workspace.

## Setup

- Copy env template: create `.env` from `.env.example` and fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional; app works locally without Supabase, but persistence requires them).
- Install deps:
```powershell
npm install
```

## Develop

- Run dev server:
```powershell
npm run dev
```
- Open `http://localhost:3000`.

## Features

- Calendar grid with drag-and-drop notes
- Mood palette per day
- Theming via DaisyUI (`earth` / `earthDark`)
- Placeholder login/register screens
 - Simple backend API under `/api/*` (optional Supabase persistence)

## Build & Start

```powershell
npm run build
npm run start
```

## Environment

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
- `NEXT_PUBLIC_DEFAULT_THEME`: optional (`earth` or `earthDark`)

## Deployment (Vercel)

Vercel auto-detects Next.js. Either use the GitHub integration or CLI.

### Quick Deploy (CLI)

```powershell
npm install -g vercel
vercel login
vercel  # first run: link or create project

# Add env vars for each environment (repeat for preview if needed)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Deploy preview
vercel

# Deploy production
vercel --prod
```

After adding env vars, trigger a redeploy if they were missing.

### GitHub Integration
1. Push repository to GitHub.
2. Import project in Vercel dashboard.
3. Set Environment Variables in Project Settings (Production & Preview).
4. Each push to `main` (or chosen branch) builds & deploys.

### Production Tips
- Consider pinning Next.js to a stable release if canary causes issues.
- Monitor build logs for any experimental warnings.
- Use `npm run build` locally to confirm before deploying.
- Keep Supabase anon key public only; never expose service role key.

## Troubleshooting Deploy
- Missing env vars: app will warn in console; set them and redeploy.
- 500 errors on API routes: confirm `days` table exists and structure matches README.
- Styling discrepancies: ensure Tailwind & DaisyUI versions match lockfile.

## API

- `GET /api/days?month=YYYY-MM`: returns days for a month. Uses Supabase `days` table if configured; otherwise returns generated in-memory days.
- `POST /api/notes` body `{ dayIso, note }`: upserts a note into the Supabase `days` table (notes in JSONB). Returns 501 if Supabase not configured.
- `PATCH /api/mood` body `{ dayIso, mood? }`: sets or clears mood for a day in Supabase.

### Supabase schema (optional)

Create a table `days`:

```
create table public.days (
	iso date primary key,
	notes jsonb,
	mood jsonb
);
```

RLS: allow anon read/write for quick testing, or implement auth rules per your needs.
