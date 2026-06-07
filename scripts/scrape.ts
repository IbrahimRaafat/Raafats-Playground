/**
 * Scrape all sources and upsert into Supabase.
 *
 * Usage:
 *   pnpm scrape                          # all sources
 *   pnpm scrape --source leetcode        # single source
 *   pnpm scrape --source bfe,greatfrontend
 *
 * Required env vars (use .env.local locally, GitHub Actions secrets in CI):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   ← service role key bypasses RLS for writes
 */
import { createClient } from '@supabase/supabase-js'
import { scrapeLeetCode } from './scrapers/leetcode'
import { scrapeBFE } from './scrapers/bfe'
import { scrapeGreatFrontend } from './scrapers/greatfrontend'
import type { RawQuestion } from './scrapers/types'

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  ''

const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n' +
    'For local runs: add both to .env.local\n' +
    'For CI: add as repository secrets'
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const SCRAPERS: Record<string, () => Promise<RawQuestion[]>> = {
  leetcode: scrapeLeetCode,
  bfe: scrapeBFE,
  greatfrontend: scrapeGreatFrontend,
}

async function upsertQuestions(questions: RawQuestion[]): Promise<number> {
  if (questions.length === 0) return 0

  const rows = questions.map((q) => ({
    source: q.source,
    source_id: q.source_id,
    title: q.title,
    description: q.description,
    type: q.type,
    difficulty: q.difficulty,
    topic: q.topic ?? null,
    companies: q.companies ?? [],
    tags: q.tags ?? [],
    answer: q.answer ?? null,
    hint: q.hint ?? null,
    starter_code: q.starter_code ?? null,
    is_premium: q.is_premium ?? false,
  }))

  // Upsert in batches to avoid request size limits
  const BATCH = 100
  let upserted = 0

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error, count } = await supabase
      .from('questions')
      .upsert(batch, { onConflict: 'source,source_id', count: 'exact' })

    if (error) {
      console.error(`Upsert failed at batch ${i / BATCH}:`, error.message)
    } else {
      upserted += count ?? batch.length
    }
  }

  return upserted
}

async function main() {
  const args = process.argv.slice(2)
  const sourceArg = args.find((a) => a.startsWith('--source='))?.split('=')[1]
    ?? args[args.indexOf('--source') + 1]

  const sources = sourceArg
    ? sourceArg.split(',').map((s) => s.trim())
    : Object.keys(SCRAPERS)

  console.log(`\nSources to scrape: ${sources.join(', ')}\n`)

  let totalUpserted = 0

  for (const source of sources) {
    const scraper = SCRAPERS[source]
    if (!scraper) {
      console.warn(`Unknown source "${source}" — skipping`)
      continue
    }

    try {
      const questions = await scraper()
      const upserted = await upsertQuestions(questions)
      console.log(`✅ ${source}: ${upserted} questions upserted\n`)
      totalUpserted += upserted
    } catch (err) {
      console.error(`❌ ${source} failed:`, err)
    }
  }

  console.log(`Done. Total upserted: ${totalUpserted}`)
}

main()
