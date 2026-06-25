'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle'
import { LanguageToggle } from '@/components/atoms/language-toggle/language-toggle'
import { LessonSearch } from '@/components/organisms/lesson-search/lesson-search'
import { NavAuth } from '@/components/organisms/nav-auth/nav-auth'

const LIME = '#cbf04f'

type Props = {
  actions?: React.ReactNode
}

function SiteNavbar({ actions }: Props) {
  return (
    <header className="sticky top-0 z-50 flex items-center px-4 h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm shrink-0">
      <Link
        href="/"
        className="flex items-center gap-1.5 font-black text-base tracking-tight me-6 shrink-0"
      >
        <span className="text-lg leading-none">{'«'}</span>
        <span>
          <span style={{ color: LIME }}>TS</span> Playground
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-0.5">
        <button className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          Tracks <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <Link
          href="/learn"
          className="text-sm px-3 py-1.5 rounded-md font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Learn
        </Link>
        <Link
          href="/questions"
          className="text-sm px-3 py-1.5 rounded-md font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Questions
        </Link>
        <Link
          href="/playground"
          className="text-sm px-3 py-1.5 rounded-md font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          Playground
        </Link>
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <LessonSearch />
        <ThemeToggle />
        <LanguageToggle />
        {actions}
        <NavAuth />
      </div>
    </header>
  )
}

export { SiteNavbar }
