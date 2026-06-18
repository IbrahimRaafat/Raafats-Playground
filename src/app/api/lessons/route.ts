import { NextResponse } from 'next/server'
import { getAllTracksAsync } from '@/lib/content/loader'

export type SearchLesson = {
  title: string
  description: string
  slug: string
  trackSlug: string
  trackTitle: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  order: number
}

export async function GET() {
  const tracks = await getAllTracksAsync()
  const lessons: SearchLesson[] = tracks.flatMap((track) =>
    track.lessons.map((lesson) => ({
      title: lesson.title,
      description: lesson.description,
      slug: lesson.slug,
      trackSlug: track.slug,
      trackTitle: track.title,
      difficulty: lesson.difficulty,
      order: lesson.order,
    }))
  )
  return NextResponse.json(lessons)
}
