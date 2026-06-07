# Deployment

## Platform

The app is deployed on **Vercel** under the `ibrahimraafats-projects` team.

- **Production URL:** configured on Vercel (check dashboard)
- **GitHub repo:** `IbrahimRaafat/Raafats-Playground`
- **Branch strategy:** feature branches → PR → merge to `main` → Vercel auto-deploys

---

## Environment variables

### Vercel (production + preview)

Set via Vercel dashboard or CLI. Both production and preview environments are configured.

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vwfxobbxbgbozaouzzkj.supabase.co` | Safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (anon JWT) | Safe to expose — RLS prevents abuse |

**Set via CLI:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production --value "https://vwfxobbxbgbozaouzzkj.supabase.co" --force
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --value "<key>" --force
```

### Local development (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://vwfxobbxbgbozaouzzkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Only needed for running scrapers locally:
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

`.env.local` is gitignored — never commit it.

### GitHub Actions secrets

Required for the weekly scrape cron:

| Secret | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS for writing scraped questions |

---

## Vercel project setup

The project was linked to Vercel with:

```bash
vercel link --scope ibrahimraafats-projects --project raafats-playground --yes
```

This creates `.vercel/project.json` locally.

---

## Build

```bash
pnpm build   # runs next build --webpack
```

**Why `--webpack`:** Turbopack has a known bug with pnpm + Windows + `src/` layout. The `--webpack` flag forces the stable webpack bundler. This applies to both local dev and Vercel (Vercel respects the script from `package.json`).

**Why `transpilePackages`:** Several packages (`@codesandbox/sandpack-react`, `next-mdx-remote`, `react-resizable-panels`) don't ship pre-built ESM. They're listed in `next.config.ts` under `transpilePackages` so webpack processes them.

---

## Deploying a new version

1. Create a feature branch:
   ```bash
   git checkout -b feat/my-feature
   ```

2. Make changes and commit.

3. Push and open a PR:
   ```bash
   git push origin feat/my-feature
   gh pr create
   ```
   Vercel creates a preview deployment automatically for every PR.

4. Merge to `main`:
   ```bash
   gh pr merge <number> --squash
   ```
   Vercel deploys to production automatically.

---

## Supabase ISR cache

The `/questions` page uses Next.js ISR with `revalidate = 3600` (1 hour). This means:
- The first request after a scrape run may serve the old cached page for up to 1 hour
- To force an immediate refresh: re-deploy from Vercel dashboard, or call `revalidatePath('/questions')` from a Server Action (not yet implemented)

---

## Storybook

Storybook is not deployed — it's a local development tool only.

```bash
pnpm storybook        # dev server at http://localhost:6006
pnpm build-storybook  # static build to storybook-static/
```

---

## Monitoring

No monitoring is set up in Phase 5. Recommended for Phase 6:
- Vercel Analytics (built-in, free tier available)
- Sentry for error tracking
- Supabase dashboard for database metrics
