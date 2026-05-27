import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Track, LessonMeta, LessonConfig } from './types'

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

export function getAllTracks(): Track[] {
  const trackDirs = fs.readdirSync(CONTENT_DIR).filter((d) => {
    return fs.statSync(path.join(CONTENT_DIR, d)).isDirectory()
  })

  return trackDirs
    .filter((slug) => TRACK_META[slug])
    .map((slug) => {
      const meta = TRACK_META[slug]
      const lessons = getLessonsForTrack(slug)
      return { slug, ...meta, lessons }
    })
}

export function getTrack(trackSlug: string): Track | null {
  if (!TRACK_META[trackSlug]) return null
  const lessons = getLessonsForTrack(trackSlug)
  return { slug: trackSlug, ...TRACK_META[trackSlug], lessons }
}

function getLessonsForTrack(trackSlug: string): LessonMeta[] {
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

export function getLessonMdx(trackSlug: string, lessonSlug: string): string | null {
  const mdxPath = path.join(CONTENT_DIR, trackSlug, lessonSlug, 'lesson.mdx')
  if (!fs.existsSync(mdxPath)) return null
  return fs.readFileSync(mdxPath, 'utf8')
}

export async function getLessonConfig(
  trackSlug: string,
  lessonSlug: string
): Promise<LessonConfig | null> {
  try {
    const mod = await import(
      `@/content/lessons/${trackSlug}/${lessonSlug}/config`
    )
    return mod.config as LessonConfig
  } catch {
    return null
  }
}
