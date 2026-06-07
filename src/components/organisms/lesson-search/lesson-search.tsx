'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, BookOpen } from 'lucide-react'
import { Button } from '@/components/atoms/button/button'
import { DifficultyBadge } from '@/components/atoms/difficulty-badge/difficulty-badge'
import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import type { SearchLesson } from '@/app/api/lessons/route'

function LessonSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [lessons, setLessons] = useState<SearchLesson[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const router = useRouter()
  const { t } = useTranslation()

  // Fetch once on first open
  useEffect(() => {
    if (open && lessons.length === 0) {
      fetch('/api/lessons').then((r) => r.json()).then(setLessons)
    }
  }, [open, lessons.length])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10)
    } else {
      setQuery('')
    }
  }, [open])

  const filtered = query.trim()
    ? lessons.filter(
        (l) =>
          l.title.toLowerCase().includes(query.toLowerCase()) ||
          l.description.toLowerCase().includes(query.toLowerCase()) ||
          l.trackTitle.toLowerCase().includes(query.toLowerCase())
      )
    : lessons

  // Group by track when no query
  const grouped = !query.trim()
    ? lessons.reduce<Record<string, SearchLesson[]>>((acc, l) => {
        if (!acc[l.trackSlug]) acc[l.trackSlug] = []
        acc[l.trackSlug].push(l)
        return acc
      }, {})
    : null

  const navigate = useCallback(
    (lesson: SearchLesson) => {
      router.push(`/learn/${lesson.trackSlug}/${lesson.slug}`)
      setOpen(false)
    },
    [router]
  )

  // Keyboard: Ctrl/Cmd+K to open, Escape to close, arrows + enter in results
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      if (!open) return

      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        navigate(filtered[selectedIndex])
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, filtered, selectedIndex, navigate])

  // Scroll selected item into view
  useEffect(() => {
    const item = listRef.current?.children[selectedIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        title="Search lessons (Ctrl+K)"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">Search</span>
        <kbd className="hidden sm:inline text-[10px] font-mono border border-border rounded px-1 py-0.5 leading-none opacity-60">⌘K</kbd>
      </Button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Dialog */}
          <div
            className="relative w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="text-[10px] font-mono border border-border rounded px-1.5 py-0.5 leading-none text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {lessons.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground gap-2">
                  <BookOpen className="h-4 w-4" />
                  {t('search.loading')}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  {t('search.empty', { query })}
                </div>
              ) : query.trim() ? (
                // Flat search results
                <ul ref={listRef} className="p-2 space-y-0.5">
                  {filtered.map((lesson, i) => (
                    <ResultItem
                      key={`${lesson.trackSlug}/${lesson.slug}`}
                      lesson={lesson}
                      selected={i === selectedIndex}
                      onSelect={() => navigate(lesson)}
                      onHover={() => setSelectedIndex(i)}
                    />
                  ))}
                </ul>
              ) : (
                // Grouped by track
                <div className="p-2">
                  {Object.entries(grouped!).map(([trackSlug, trackLessons]) => (
                    <div key={trackSlug} className="mb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground px-3 py-1.5">
                        {trackLessons[0].trackTitle}
                      </p>
                      <ul>
                        {trackLessons.map((lesson) => {
                          const flatIndex = filtered.indexOf(lesson)
                          return (
                            <ResultItem
                              key={`${lesson.trackSlug}/${lesson.slug}`}
                              lesson={lesson}
                              selected={flatIndex === selectedIndex}
                              onSelect={() => navigate(lesson)}
                              onHover={() => setSelectedIndex(flatIndex)}
                            />
                          )
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-t border-border text-[11px] text-muted-foreground">
              <span><kbd className="font-mono">↑↓</kbd> {t('search.navigate')}</span>
              <span><kbd className="font-mono">↵</kbd> {t('search.open')}</span>
              <span><kbd className="font-mono">ESC</kbd> {t('search.close')}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ResultItem({
  lesson,
  selected,
  onSelect,
  onHover,
}: {
  lesson: SearchLesson
  selected: boolean
  onSelect: () => void
  onHover: () => void
}) {
  return (
    <li>
      <button
        onClick={onSelect}
        onMouseEnter={onHover}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-start transition-colors ${
          selected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
        }`}
      >
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="flex-1 min-w-0">
          <span className="text-sm font-medium block truncate">{lesson.title}</span>
          {lesson.description && (
            <span className="text-xs text-muted-foreground block truncate">{lesson.description}</span>
          )}
        </span>
        <DifficultyBadge difficulty={lesson.difficulty} />
      </button>
    </li>
  )
}

export { LessonSearch }
