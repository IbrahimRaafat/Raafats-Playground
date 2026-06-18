/**
 * Seeds the Supabase questions table from the local data.ts file.
 * Run with: npx tsx scripts/seed-questions.ts
 */
import { createClient } from '@supabase/supabase-js'
import { questions } from '../src/lib/questions/data'
import type { PlaygroundConfig } from '../src/lib/content/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://vwfxobbxbgbozaouzzkj.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY
if (!key) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY — set in .env.local')
  process.exit(1)
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Using anon key — RLS may block inserts. Set SUPABASE_SERVICE_ROLE_KEY for full access.')
}

const supabase = createClient(SUPABASE_URL, key)

function buildPlaygroundConfig(q: typeof questions[0]): PlaygroundConfig | null {
  if (q.type === 'theory') return null

  const starterFiles: Record<string, string> = {}
  if (q.starterCode) {
    starterFiles['/index.ts'] = q.starterCode
  }

  return {
    showPreview: false,
    showConsole: true,
    showTests: false,
    testCodeVisible: false,
    autorun: false,
    starterFiles,
    solutionFiles: {},
  }
}

const rows = questions.map((q) => ({
  source: 'manual',
  source_id: q.id,
  title: q.title,
  description: q.description,
  type: q.type,
  difficulty: q.difficulty,
  topic: q.topic ?? null,
  companies: q.companies,
  tags: [],
  answer: q.answer ?? null,
  hint: q.hint ?? null,
  starter_code: q.starterCode ?? null,
  is_premium: false,
  playground_config: buildPlaygroundConfig(q),
}))

async function main() {
  console.log(`Seeding ${rows.length} questions…`)

  const { data, error } = await supabase
    .from('questions')
    .upsert(rows, { onConflict: 'source,source_id', ignoreDuplicates: false })
    .select('id, title')

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`✅ Seeded ${data?.length ?? 0} questions`)
  data?.forEach((r) => console.log(` • ${r.title}`))
}

main()
