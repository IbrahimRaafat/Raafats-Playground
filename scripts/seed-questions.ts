/**
 * Seeds the Supabase questions table from the local data.ts file.
 * Run with: npx tsx scripts/seed-questions.ts
 */
import { createClient } from '@supabase/supabase-js'
import { questions } from '../src/lib/questions/data'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://vwfxobbxbgbozaouzzkj.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!SUPABASE_ANON_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY — set it in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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
