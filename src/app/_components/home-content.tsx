'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ChevronDown, X, Code2, BookOpen, Zap,
  CheckCircle2, BarChart2, Star, MessageSquare,
} from 'lucide-react'
import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle'
import { LanguageToggle } from '@/components/atoms/language-toggle/language-toggle'
import { LessonSearch } from '@/components/organisms/lesson-search/lesson-search'
import { TrackCard } from '@/components/molecules/track-card/track-card'
import type { Track } from '@/lib/content/types'

const LIME = '#cbf04f'

const AVATARS = [
  { bg: '#f97316', label: 'A' },
  { bg: '#8b5cf6', label: 'B' },
  { bg: '#06b6d4', label: 'C' },
  { bg: '#10b981', label: 'D' },
  { bg: '#f59e0b', label: 'E' },
  { bg: '#ec4899', label: 'F' },
  { bg: '#3b82f6', label: 'G' },
]

export function HomeContent({ tracks }: { tracks: Track[] }) {
  const { t } = useTranslation()
  const [bannerOpen, setBannerOpen] = useState(true)
  const [toastOpen, setToastOpen] = useState(true)
  const totalLessons = tracks.reduce((acc, tr) => acc + tr.lessons.length, 0)

  const features = [
    { icon: <Code2 className="h-5 w-5" />, title: t('feature.editor.title'), body: t('feature.editor.body') },
    { icon: <BookOpen className="h-5 w-5" />, title: t('feature.lessons.title'), body: t('feature.lessons.body') },
    { icon: <Zap className="h-5 w-5" />, title: t('feature.tests.title'), body: t('feature.tests.body') },
  ]

  const learnItems = [
    t('learn.item.1'), t('learn.item.2'), t('learn.item.3'),
    t('learn.item.4'), t('learn.item.5'), t('learn.item.6'),
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">

      {/* ── Announcement banner ── */}
      {bannerOpen && (
        <div className="relative flex items-center justify-center px-10 py-2.5 text-sm font-medium text-neutral-900" style={{ background: LIME }}>
          <span>
            {totalLessons} interactive lessons now live — start your TypeScript journey{' '}
            <Link href="/learn" className="inline-flex items-center gap-0.5 font-bold underline-offset-2 hover:underline">
              Check it out <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </span>
          <button
            onClick={() => setBannerOpen(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/15 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 flex items-center px-6 h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 font-black text-base tracking-tight me-6 shrink-0">
          <span className="text-lg leading-none">{'«'}</span>
          <span><span style={{ color: LIME }}>TS</span> Playground</span>
        </Link>

        {/* Left nav */}
        <nav className="hidden md:flex items-center">
          <button className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            Tracks
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mb-2" />
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <Link href="/learn" className="text-sm px-3 py-1.5 rounded-md font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            Learn
          </Link>
          <button className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            Playground <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </nav>

        <div className="flex-1" />

        {/* Right nav */}
        <div className="flex items-center gap-1">
          <button className="hidden md:block text-sm px-3 py-1.5 rounded-md font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            Pricing
          </button>
          <button className="hidden md:block text-sm px-3 py-1.5 rounded-md font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            Sign in / up
          </button>
          <LessonSearch />
          <ThemeToggle />
          <LanguageToggle />
          <Link
            href="/learn"
            className="ms-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-neutral-900 hover:opacity-90 transition-opacity"
            style={{ background: LIME }}
          >
            Get full access
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-6 md:px-12 lg:px-20 pt-12 pb-0 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left column */}
          <div className="pt-6">
            {/* Badge */}
            <button className="mb-6 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors">
              New lessons added in Jun 2026 <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.03] mb-6 text-neutral-900 dark:text-white">
              Master TypeScript & React through interactive practice
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed max-w-lg">
              The <strong className="text-neutral-900 dark:text-neutral-100 font-semibold">TypeScript learning platform</strong> built to take you
              from beginner to confident, with live code execution and auto-graded tests.
              Written by developers from{' '}
              <strong className="text-neutral-900 dark:text-neutral-100 font-bold">Google</strong>,{' '}
              <strong className="text-neutral-900 dark:text-neutral-100 font-bold">Meta</strong>,{' '}
              <strong className="text-neutral-900 dark:text-neutral-100 font-bold">Amazon</strong>.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-start gap-6 mb-10">
              <div className="flex flex-col items-center gap-1.5">
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-neutral-900 hover:opacity-90 transition-opacity shadow-lg"
                  style={{ background: LIME }}
                >
                  Get started now <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-xs text-neutral-500">No signup required</span>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2.5">
                  {AVATARS.map((av, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-white dark:border-neutral-950 flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: av.bg }}
                    >
                      {av.label}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{totalLessons}+ lessons available</div>
                  <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <BarChart2 className="h-3 w-3" />
                    Across {tracks.length} learning tracks
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — browser mockup */}
          <div className="hidden lg:block relative mt-4">
            <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white dark:bg-neutral-700 rounded px-3 py-0.5 text-xs text-neutral-400 text-center">
                  🔒 ts-playground.vercel.app
                </div>
              </div>
              {/* Playground preview */}
              <div className="bg-neutral-900 h-72 relative overflow-hidden font-mono text-xs">
                <div className="absolute inset-0 flex">
                  {/* Instructions pane */}
                  <div className="w-1/3 border-r border-neutral-700 p-3 text-neutral-400 text-[10px] leading-relaxed overflow-hidden">
                    <div className="font-bold text-neutral-200 mb-1">Variables</div>
                    <div className="text-neutral-500 mb-2">beginner</div>
                    <div>TypeScript inherits JS's three ways to declare variables…</div>
                    <div className="mt-2 font-semibold text-neutral-300">Your task</div>
                    <div className="mt-1">Declare a <span className="text-purple-400">const</span> named <span className="text-blue-300">greeting</span></div>
                  </div>
                  {/* Editor pane */}
                  <div className="flex-1 p-3 overflow-hidden">
                    <div className="flex gap-2 mb-2 text-[10px] text-neutral-500 border-b border-neutral-700 pb-1.5">
                      <span className="text-neutral-200">index.ts</span>
                      <span>__tests__.ts</span>
                    </div>
                    <div className="text-neutral-300">
                      <span className="text-neutral-600 mr-2 select-none">1</span>
                      <span className="text-purple-400">export</span>{' '}
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-blue-300">greeting</span>{' = '}
                      <span className="text-green-300">"Hello, World!"</span>
                      <span>;</span>
                    </div>
                    <div className="text-neutral-600 mt-1">
                      <span className="mr-2">2</span>
                    </div>
                  </div>
                </div>
                {/* Bottom bar */}
                <div className="absolute bottom-0 inset-x-0 flex items-center gap-2 px-3 py-2 bg-neutral-800 border-t border-neutral-700 text-[10px]">
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-700">
                    ↺ Reset
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded text-neutral-900 font-semibold" style={{ background: LIME }}>
                    ▶ Run Tests
                  </div>
                  <div className="flex items-center gap-1 ms-auto text-green-400">
                    ✅ All tests passed
                  </div>
                </div>
                {/* Gradient fade at top */}
                <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-neutral-900 to-transparent pointer-events-none" />
              </div>
            </div>
            {/* Glow */}
            <div className="absolute -inset-4 -z-10 rounded-2xl opacity-20 blur-3xl" style={{ background: LIME }} />
          </div>
        </div>
      </section>

      {/* ── Tracks ── */}
      <section className="px-6 md:px-12 lg:px-20 py-16 max-w-7xl mx-auto w-full">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6 text-center">
          {t('section.tracks')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tracks.map((track) => (
            <TrackCard key={track.slug} track={track} layout="grid" />
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-6 md:px-12 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-900"
                style={{ background: LIME }}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100">{f.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you'll learn ── */}
      <section className="px-6 md:px-12 lg:px-20 py-16 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-black tracking-tight mb-8 text-center text-neutral-900 dark:text-white">
          {t('section.whatYouLearn')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {learnItems.map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-neutral-900 dark:text-neutral-100" style={{ color: LIME.replace('f0', 'a0') }} />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-neutral-100 dark:border-neutral-800 px-6 py-6 text-center text-xs text-neutral-400">
        {t('footer.text')}
      </footer>

      {/* ── Floating toast ── */}
      {toastOpen && (
        <div className="fixed bottom-16 right-4 z-50 flex items-start gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl px-4 py-3 max-w-xs">
          <div
            className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-neutral-900 shrink-0"
            style={{ background: LIME }}
          >
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <div className="flex-1 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              Someone from <strong className="text-neutral-900 dark:text-neutral-100">Egypt</strong> started the{' '}
              <Link href="/learn/javascript" className="text-blue-500 hover:underline font-medium">JavaScript track</Link>{' '}
              recently
            </span>
          </div>
          <button onClick={() => setToastOpen(false)} className="shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Online counter + Feedback ── */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-full px-3 py-1.5 shadow text-xs font-medium text-neutral-700 dark:text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>
        <button className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-full px-3 py-1.5 shadow text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
          <MessageSquare className="h-3.5 w-3.5" />
          Feedback
        </button>
      </div>

    </div>
  )
}
