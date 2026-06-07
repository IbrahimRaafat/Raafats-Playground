# Scraping

The questions database is populated from three sources: manually curated questions, LeetCode, GreatFrontend, and BFE.dev. A GitHub Actions workflow runs every Sunday to keep the database fresh.

---

## Running scrapers locally

### Prerequisites

Add to `.env.local`:

```env
SUPABASE_URL=https://vwfxobbxbgbozaouzzkj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service role key from Supabase dashboard>
```

The service role key is required for writes — it bypasses RLS. Get it from:
**[Supabase dashboard → Settings → API](https://supabase.com/dashboard/project/vwfxobbxbgbozaouzzkj/settings/api)** → `service_role` section.

### Commands

```bash
# Scrape all sources
pnpm tsx --env-file=.env.local scripts/scrape.ts

# Scrape a specific source
pnpm tsx --env-file=.env.local scripts/scrape.ts --source leetcode
pnpm tsx --env-file=.env.local scripts/scrape.ts --source bfe,greatfrontend
```

---

## Sources

### LeetCode (`scripts/scrapers/leetcode.ts`)

**What it fetches:**
- All problems tagged with `javascript`, `typescript`, `react`, `css`, `html`, or `dom` via the public GraphQL API at `https://leetcode.com/graphql`
- Company tags from the community dataset: [`hxu296/leetcode-company-wise-problems-2022`](https://github.com/hxu296/leetcode-company-wise-problems-2022) (downloaded as JSON — no scraping, no ToS issues)

**What it stores:**
- Title, difficulty, topic (inferred from tags), companies, LeetCode tags
- Description is a placeholder linking to the original problem — LeetCode's full problem content requires authentication

**Limitations:**
- Only free (non-premium) problems are included
- Problem descriptions are not available without a LeetCode session cookie
- Company data is from 2022 and may be stale

**Stored as:** `source = 'leetcode'`, `source_id = titleSlug`

---

### BFE.dev (`scripts/scrapers/bfe.ts`)

**What it fetches:**
- Full public problem list from `https://bigfrontend.dev/problem`
- Problem descriptions via individual page fetches (HTML parsing)

**What it stores:**
- Title, difficulty, description (when parseable)

**Limitations:**
- HTML parsing is brittle — if BFE changes their page structure, the scraper will return 0 results (this happened after initial implementation)
- No company data available

**Stored as:** `source = 'bfe'`, `source_id = problem number`

---

### GreatFrontend (`scripts/scrapers/greatfrontend.ts`)

**What it fetches:**
- A hardcoded list of ~28 known free JS/UI problems
- Descriptions fetched from individual problem pages (`.prose` section)

**What it stores:**
- Title, difficulty, topic, description (when parseable)

**Limitations:**
- Only free problems; paid problems are behind a login wall
- The problem list is hardcoded — new GreatFrontend problems won't be discovered automatically unless the list is updated in the scraper
- Description parsing may break if GreatFrontend changes their layout

**Stored as:** `source = 'greatfrontend'`, `source_id = 'category/slug'`

---

### Manual (`scripts/seed-questions.ts`)

Curated questions written by hand in `src/lib/questions/data.ts`. These have full descriptions, hints, starter code, and answers. Run with `pnpm seed`.

**Stored as:** `source = 'manual'`, `source_id = question id`

---

## GitHub Actions workflow

File: `.github/workflows/scrape-questions.yml`

**Schedule:** Every Sunday at 02:00 UTC (`cron: '0 2 * * 0'`)

**Manual trigger:** Go to Actions tab → "Scrape Questions" → "Run workflow". You can specify a source (`leetcode`, `bfe`, `greatfrontend`, or `all`).

**Required GitHub secrets:**

| Secret | Value |
|---|---|
| `SUPABASE_URL` | `https://vwfxobbxbgbozaouzzkj.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key from Supabase dashboard |

Set via CLI:
```bash
gh secret set SUPABASE_URL --body "https://vwfxobbxbgbozaouzzkj.supabase.co" --repo IbrahimRaafat/Raafats-Playground
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "<key>" --repo IbrahimRaafat/Raafats-Playground
```

---

## Upsert behaviour

All scrapers upsert on `(source, source_id)`. Running the same scraper twice will update existing rows rather than creating duplicates. This means:
- Updated descriptions, difficulty, or company tags from the source will be reflected
- Questions deleted from the source are NOT removed from the database (manual cleanup required)

---

## Adding a new source

1. Create `scripts/scrapers/<name>.ts` and export `async function scrape<Name>(): Promise<RawQuestion[]>`
2. `RawQuestion` type is in `scripts/scrapers/types.ts`
3. Register the scraper in `scripts/scrape.ts`:
   ```ts
   import { scrapeMySource } from './scrapers/mysource'

   const SCRAPERS = {
     ...existing,
     mysource: scrapeMySource,
   }
   ```
4. Run `pnpm tsx --env-file=.env.local scripts/scrape.ts --source mysource` to test
5. The GitHub Actions workflow picks up the new source automatically when `all` is used

---

## Current database counts

| Source | Questions |
|---|---|
| LeetCode | ~100 |
| GreatFrontend | ~28 |
| Manual | 30 |
| BFE.dev | 0 (scraper needs fixing) |
| **Total** | **~158** |
