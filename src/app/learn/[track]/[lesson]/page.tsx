import { notFound } from 'next/navigation'
import { getTrack, getLessonMdx, getLessonConfig } from '@/lib/content/loader'
import { LessonPlayground } from '@/components/organisms/lesson-playground/lesson-playground'
import { LessonInstructions } from '@/components/organisms/lesson-instructions/lesson-instructions'
import { LessonNav } from '@/components/molecules/lesson-nav/lesson-nav'
import { BreadcrumbNav } from '@/components/molecules/breadcrumb-nav/breadcrumb-nav'
import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle'
import { LanguageToggle } from '@/components/atoms/language-toggle/language-toggle'
import { LessonCompletedBadge } from '@/components/atoms/lesson-completed-badge/lesson-completed-badge'

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

  const instructions = <LessonInstructions meta={meta} mdxSource={mdxSource} />

  return (
    <div className="h-screen flex flex-col">
      <BreadcrumbNav
        items={[
          { labelKey: 'breadcrumb.learn', href: '/learn' },
          { label: track.title, href: `/learn/${trackSlug}` },
          { label: meta.title },
        ]}
        actions={<><LessonCompletedBadge lessonId={`${trackSlug}/${lessonSlug}`} /><ThemeToggle /><LanguageToggle /></>}
      />

      <div className="flex-1 min-h-0">
        <LessonPlayground
          lessonId={`${trackSlug}/${lessonSlug}`}
          template={config.sandpackTemplate}
          files={config.starterFiles}
          testFile={config.testFile}
          instructions={instructions}
        />
      </div>

      <LessonNav track={trackSlug} prev={prev} next={next} />
    </div>
  )
}
