'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import { BreadcrumbNav } from '@/components/molecules/breadcrumb-nav/breadcrumb-nav'
import { LessonCard } from '@/components/molecules/lesson-card/lesson-card'
import { TrackProgress } from '@/components/organisms/track-progress/track-progress'
import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle'
import { LanguageToggle } from '@/components/atoms/language-toggle/language-toggle'
import { getAllProgress } from '@/lib/progress/store'
import type { Track } from '@/lib/content/types'

export function TrackContent({ track }: { track: Track }) {
  const { t } = useTranslation()
  const [progress, setProgress] = useState<Record<string, string>>({})

  useEffect(() => {
    getAllProgress().then(setProgress)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbNav
        items={[
          { labelKey: 'breadcrumb.learn', href: '/learn' },
          { label: track.title },
        ]}
        actions={<><ThemeToggle /><LanguageToggle /></>}
      />

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary font-bold font-mono">
              {track.icon}
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{track.title}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {t('track.lessons', { count: track.lessons.length })}
              </p>
            </div>
          </div>
          <p className="text-muted-foreground pt-1">{track.description}</p>
        </div>

        <TrackProgress trackSlug={track.slug} lessons={track.lessons} />

        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t('track.section.lessons')}
          </h2>
          <ul className="space-y-2">
            {track.lessons.map((lesson, i) => (
              <li key={lesson.slug}>
                <LessonCard
                  lesson={lesson}
                  index={i + 1}
                  trackSlug={track.slug}
                  completed={progress[`${track.slug}/${lesson.slug}`] === 'completed'}
                />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
