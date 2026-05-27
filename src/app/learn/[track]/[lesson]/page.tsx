import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTrack, getLessonMdx, getLessonConfig } from '@/lib/content/loader'
import { PlaygroundRoot } from '@/components/playground/playground-root'
import { PlaygroundLayout } from '@/components/playground/playground-layout'
import { LessonInstructions } from '@/components/lessons/lesson-instructions'
import { LessonNav } from '@/components/lessons/lesson-nav'
import { ChevronLeft } from 'lucide-react'

type Props = { params: Promise<{ track: string; lesson: string }> }

export async function generateMetadata({ params }: Props) {
  const { track: trackSlug, lesson: lessonSlug } = await params
  const track = getTrack(trackSlug)
  const meta = track?.lessons.find((l) => l.slug === lessonSlug)
  return { title: meta ? `${meta.title} — TS Playground` : 'Not found' }
}

export default async function LessonPage({ params }: Props) {
  const { track: trackSlug, lesson: lessonSlug } = await params

  const track = getTrack(trackSlug)
  if (!track) notFound()

  const lessonIndex = track.lessons.findIndex((l) => l.slug === lessonSlug)
  if (lessonIndex === -1) notFound()

  const meta = track.lessons[lessonIndex]
  const prev = track.lessons[lessonIndex - 1] ?? null
  const next = track.lessons[lessonIndex + 1] ?? null

  const [mdxSource, config] = await Promise.all([
    getLessonMdx(trackSlug, lessonSlug),
    getLessonConfig(trackSlug, lessonSlug),
  ])

  if (!mdxSource || !config) notFound()

  const allFiles: Record<string, string> = {
    ...config.starterFiles,
    ...(config.testFile ? { '/__tests__.ts': config.testFile } : {}),
  }

  const instructions = <LessonInstructions meta={meta} mdxSource={mdxSource} />

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center gap-3 px-4 py-2 border-b border-border bg-background shrink-0">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">
          TS Playground
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href={`/learn/${trackSlug}`} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <ChevronLeft className="h-3 w-3" />
          {track.title}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm truncate max-w-[200px]">{meta.title}</span>
      </header>

      <div className="flex-1 min-h-0">
        <PlaygroundRoot
          template={config.sandpackTemplate}
          files={allFiles}
          hiddenFiles={['/__tests__.ts']}
        >
          <PlaygroundLayout
            instructions={instructions}
            testFile={config.testFile}
          />
        </PlaygroundRoot>
      </div>

      <LessonNav track={trackSlug} prev={prev} next={next} />
    </div>
  )
}
