import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { supabase } from '@/lib/supabase/client'
import type { Track, LessonMeta, LessonConfig, PlaygroundConfig } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'lessons')

const TRACK_META: Record<string, { title: string; description: string; icon: string }> = {
  javascript: {
    title: 'JavaScript',
    description: 'Core JS fundamentals — variables, functions, closures, async, and more.',
    icon: 'JS',
  },
  react: {
    title: 'React',
    description: 'Build UIs with React — JSX, components, hooks, and state management.',
    icon: 'Re',
  },
}

type DbLesson = {
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
  playground_config: PlaygroundConfig | null
}

// ─── Supabase fetchers ───────────────────────────────────────────────

async function fetchLessonsFromDb(): Promise<DbLesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[loader] Failed to fetch lessons from Supabase:', error.message)
    return []
  }

  return (data as DbLesson[]) ?? []
}

async function fetchLessonFromDb(trackSlug: string, slug: string): Promise<DbLesson | null> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('track_slug', trackSlug)
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as DbLesson
}

// ─── Disk fallback helpers ────────────────────────────────────────────

function getLessonsFromDisk(trackSlug: string): LessonMeta[] {
  const trackDir = path.join(CONTENT_DIR, trackSlug)
  if (!fs.existsSync(trackDir)) return []

  const lessonDirs = fs.readdirSync(trackDir).filter((d) => {
    return fs.statSync(path.join(trackDir, d)).isDirectory()
  })

  return lessonDirs
    .map((slug) => {
      const mdxPath = path.join(trackDir, slug, 'lesson.mdx')
      if (!fs.existsSync(mdxPath)) return null
      const { data } = matter(fs.readFileSync(mdxPath, 'utf8'))
      return {
        slug,
        trackSlug,
        title: data.title ?? slug,
        description: data.description ?? '',
        difficulty: data.difficulty ?? 'beginner',
        order: data.order ?? 0,
      } as LessonMeta
    })
    .filter(Boolean)
    .sort((a, b) => a!.order - b!.order) as LessonMeta[]
}

function getMdxFromDisk(trackSlug: string, lessonSlug: string): string | null {
  const mdxPath = path.join(CONTENT_DIR, trackSlug, lessonSlug, 'lesson.mdx')
  if (!fs.existsSync(mdxPath)) return null
  return matter(fs.readFileSync(mdxPath, 'utf8')).content
}

async function getConfigFromDisk(trackSlug: string, lessonSlug: string): Promise<LessonConfig | null> {
  try {
    const mod = await import(`@/content/lessons/${trackSlug}/${lessonSlug}/config`)
    return mod.config as LessonConfig
  } catch {
    return null
  }
}

// ─── Public API (Supabase-first, disk fallback) ───────────────────────

export function getAllTracks(): Track[] {
  // Track metadata is still hardcoded — only lesson content moves to DB
  return Object.entries(TRACK_META).map(([slug, meta]) => ({
    slug,
    ...meta,
    lessons: [], // populated async below
  }))
}

export async function getAllTracksAsync(): Promise<Track[]> {
  const lessons = await fetchLessonsFromDb()
  const byTrack = new Map<string, DbLesson[]>()

  for (const l of lessons) {
    if (!TRACK_META[l.track_slug]) continue
    if (!byTrack.has(l.track_slug)) byTrack.set(l.track_slug, [])
    byTrack.get(l.track_slug)!.push(l)
  }

  // Fall back to disk if DB is empty
  if (lessons.length === 0) {
    return Object.entries(TRACK_META).map(([slug, meta]) => ({
      slug,
      ...meta,
      lessons: getLessonsFromDisk(slug),
    }))
  }

  return Object.entries(TRACK_META).map(([slug, meta]) => ({
    slug,
    ...meta,
    lessons: byTrack.get(slug)?.map((l) => ({
      slug: l.slug,
      trackSlug: l.track_slug,
      title: l.title,
      description: l.description,
      difficulty: l.difficulty as LessonMeta['difficulty'],
      order: l.sort_order,
    })) ?? [],
  }))
}

export async function getTrackAsync(trackSlug: string): Promise<Track | null> {
  if (!TRACK_META[trackSlug]) return null

  const dbLessons = await fetchLessonsFromDb()
  const trackLessons = dbLessons.filter((l) => l.track_slug === trackSlug)

  if (trackLessons.length > 0) {
    return {
      slug: trackSlug,
      ...TRACK_META[trackSlug],
      lessons: trackLessons.map((l) => ({
        slug: l.slug,
        trackSlug: l.track_slug,
        title: l.title,
        description: l.description,
        difficulty: l.difficulty as LessonMeta['difficulty'],
        order: l.sort_order,
      })),
    }
  }

  // Fallback to disk
  return {
    slug: trackSlug,
    ...TRACK_META[trackSlug],
    lessons: getLessonsFromDisk(trackSlug),
  }
}

// Sync versions kept for generateMetadata (must be sync)
export function getTrack(trackSlug: string): Track | null {
  if (!TRACK_META[trackSlug]) return null
  return {
    slug: trackSlug,
    ...TRACK_META[trackSlug],
    lessons: getLessonsFromDisk(trackSlug),
  }
}

export async function getLessonMdx(trackSlug: string, lessonSlug: string): Promise<string | null> {
  const db = await fetchLessonFromDb(trackSlug, lessonSlug)
  if (db?.mdx_content) return db.mdx_content
  return getMdxFromDisk(trackSlug, lessonSlug)
}

export async function getLessonConfig(
  trackSlug: string,
  lessonSlug: string
): Promise<LessonConfig | null> {
  const db = await fetchLessonFromDb(trackSlug, lessonSlug)

  if (db) {
    return {
      id: `${trackSlug}-${lessonSlug}`,
      title: db.title,
      difficulty: db.difficulty as LessonConfig['difficulty'],
      sandpackTemplate: db.sandpack_template as LessonConfig['sandpackTemplate'],
      starterFiles: db.starter_files,
      solutionFiles: db.solution_files,
      testFile: db.test_file,
      playground: db.playground_config ?? undefined,
    }
  }

  return getConfigFromDisk(trackSlug, lessonSlug)
}
