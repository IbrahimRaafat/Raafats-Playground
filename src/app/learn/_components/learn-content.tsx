'use client'

import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import { BreadcrumbNav } from '@/components/molecules/breadcrumb-nav/breadcrumb-nav'
import { TrackCard } from '@/components/molecules/track-card/track-card'
import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle'
import { LanguageToggle } from '@/components/atoms/language-toggle/language-toggle'
import type { Track } from '@/lib/content/types'

export function LearnContent({ tracks }: { tracks: Track[] }) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbNav
        items={[{ labelKey: 'breadcrumb.learn' }]}
        actions={<><ThemeToggle /><LanguageToggle /></>}
      />

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t('learn.title')}</h1>
          <p className="text-muted-foreground">{t('learn.subtitle')}</p>
        </div>

        <ul className="space-y-3">
          {tracks.map((track) => (
            <li key={track.slug}>
              <TrackCard track={track} layout="list" />
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
