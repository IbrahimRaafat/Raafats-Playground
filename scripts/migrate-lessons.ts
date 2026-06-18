/**
 * Migrates all lessons from disk (config.ts + lesson.mdx) into the Supabase `lessons` table.
 * Run with: npx tsx --env-file=.env.local scripts/migrate-lessons.ts
 */
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import matter from 'gray-matter'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://vwfxobbxbgbozaouzzkj.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const key = SERVICE_KEY || ANON_KEY
if (!key) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

if (!SERVICE_KEY) {
  console.warn('⚠️  Using anon key — may fail due to RLS. Set SUPABASE_SERVICE_ROLE_KEY.')
}

const supabase = createClient(SUPABASE_URL, key)

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'lessons')

type LessonRow = {
  track_slug: string
  slug: string
  title: string
  description: string
  difficulty: string
  sort_order: number
  mdx_content: string
  sandpack_template: string
  starter_files: Record<string, string>
  solution_files: Record<string, string>
  test_file: string
  playground_config: object | null
}

async function main() {
  const trackDirs = fs.readdirSync(CONTENT_DIR).filter((d) => {
    return fs.statSync(path.join(CONTENT_DIR, d)).isDirectory()
  })

  const rows: LessonRow[] = []

  for (const trackSlug of trackDirs) {
    const trackPath = path.join(CONTENT_DIR, trackSlug)
    const lessonDirs = fs.readdirSync(trackPath).filter((d) => {
      return fs.statSync(path.join(trackPath, d)).isDirectory()
    })

    for (const slug of lessonDirs) {
      const lessonPath = path.join(trackPath, slug)
      const configPath = path.join(lessonPath, 'config.ts')
      const mdxPath = path.join(lessonPath, 'lesson.mdx')

      if (!fs.existsSync(configPath) || !fs.existsSync(mdxPath)) continue

      // Read MDX
      const mdxRaw = fs.readFileSync(mdxPath, 'utf8')
      const { data: frontmatter, content: mdxContent } = matter(mdxRaw)

      // Read config (dynamic import won't work in tsx for JSON, so parse manually)
      const configCode = fs.readFileSync(configPath, 'utf8')

      // Extract config object using regex (simpler than eval for security)
      const starterMatch = configCode.match(/starterFiles:\s*\{([\s\S]*?)\n\s*\}/)
      const solutionMatch = configCode.match(/solutionFiles:\s*\{([\s\S]*?)\n\s*\}/)
      const testMatch = configCode.match(/testFile:\s*`([\s\S]*?)`/)
      const templateMatch = configCode.match(/sandpackTemplate:\s*['"]([^'"]+)['"]/)
      const idMatch = configCode.match(/id:\s*['"]([^'"]+)['"]/)

      const starterFiles: Record<string, string> = {}
      const solutionFiles: Record<string, string> = {}

      // Parse starter files
      if (starterMatch) {
        const fileMatches = starterMatch[1].matchAll(/['"]([^'"]+)['"]:\s*`([\s\S]*?)`/g)
        for (const m of fileMatches) {
          starterFiles[m[1]] = m[2]
        }
      }

      // Parse solution files
      if (solutionMatch) {
        const fileMatches = solutionMatch[1].matchAll(/['"]([^'"]+)['"]:\s*`([\s\S]*?)`/g)
        for (const m of fileMatches) {
          solutionFiles[m[1]] = m[2]
        }
      }

      rows.push({
        track_slug: trackSlug,
        slug,
        title: frontmatter.title ?? slug,
        description: frontmatter.description ?? '',
        difficulty: frontmatter.difficulty ?? 'beginner',
        sort_order: frontmatter.order ?? 0,
        mdx_content: mdxContent,
        sandpack_template: templateMatch?.[1] ?? 'vanilla-ts',
        starter_files: starterFiles,
        solution_files: solutionFiles,
        test_file: testMatch?.[1] ?? '',
        playground_config: null,
      })
    }
  }

  console.log(`Migrating ${rows.length} lessons…`)

  const { data, error } = await supabase
    .from('lessons')
    .upsert(rows, { onConflict: 'track_slug,slug', ignoreDuplicates: false })
    .select('track_slug, slug, title')

  if (error) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  }

  console.log(`✅ Migrated ${data?.length ?? 0} lessons`)
  data?.forEach((r) => console.log(` • [${r.track_slug}] ${r.title}`))
}

main()
