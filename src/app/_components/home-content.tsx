'use client'

import Link from 'next/link'
import { Code2, BookOpen, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle'
import { LanguageToggle } from '@/components/atoms/language-toggle/language-toggle'
import { LessonSearch } from '@/components/organisms/lesson-search/lesson-search'
import { TrackCard } from '@/components/molecules/track-card/track-card'
import type { Track } from '@/lib/content/types'

export function HomeContent({ tracks }: { tracks: Track[] }) {
  const { t } = useTranslation()
  const totalLessons = tracks.reduce((acc, tr) => acc + tr.lessons.length, 0)

  const features = [
    {
      icon: <Code2 className="h-5 w-5 text-primary" />,
      title: t('feature.editor.title'),
      body: t('feature.editor.body'),
    },
    {
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: t('feature.lessons.title'),
      body: t('feature.lessons.body'),
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: t('feature.tests.title'),
      body: t('feature.tests.body'),
    },
  ]

  const learnItems = [
    t('learn.item.1'),
    t('learn.item.2'),
    t('learn.item.3'),
    t('learn.item.4'),
    t('learn.item.5'),
    t('learn.item.6'),
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 border-b border-border bg-background/80 backdrop-blur-sm">
        <span className="font-bold text-base tracking-tight">
          <span className="text-primary">TS</span> Playground
        </span>
        <nav className="flex items-center gap-1">
          <Link href="/learn" className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            {t('nav.learn')}
          </Link>
          <Link href="/playground" className="text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            {t('nav.playground')}
          </Link>
          <LessonSearch />
          <ThemeToggle />
          <LanguageToggle />
        </nav>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground font-medium mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t('hero.stat', { lessons: totalLessons, tracks: tracks.length })}
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight max-w-2xl leading-[1.1] mb-6">
            {t('hero.headline1')}{' '}
            <span className="text-primary">{t('hero.headline2')}</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {t('hero.cta.start')}
              <ArrowRight className="h-4 w-4 rtl:scale-x-[-1]" />
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
            >
              {t('hero.cta.playground')}
            </Link>
          </div>
        </section>

        {/* Tracks */}
        <section className="px-6 pb-16 max-w-4xl mx-auto w-full">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6 text-center">
            {t('section.tracks')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tracks.map((track) => (
              <TrackCard key={track.slug} track={track} layout="grid" />
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-muted/30 px-6 py-16">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What you'll learn */}
        <section className="px-6 py-16 max-w-4xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('section.whatYouLearn')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {learnItems.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        {t('footer.text')}
      </footer>
    </div>
  )
}
