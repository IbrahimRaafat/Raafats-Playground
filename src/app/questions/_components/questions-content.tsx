'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Code2, BookOpen, ArrowRight, ExternalLink } from 'lucide-react'
import { questions, COMPANY_COLORS, type Difficulty, type QuestionType } from '@/lib/questions/data'

const LIME = '#cbf04f'

const DIFF_STYLES: Record<Difficulty, string> = {
  easy: 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950',
  medium: 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-950',
  hard: 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950',
}

const TYPE_STYLES: Record<QuestionType, string> = {
  coding: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-950',
  theory: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-950',
}

function CompanyBadge({ name }: { name: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${COMPANY_COLORS[name] ?? 'bg-neutral-100 text-neutral-700'}`}>
      {name}
    </span>
  )
}

function QuestionRow({ q, expanded, onToggle }: {
  q: typeof questions[number]
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors group"
      >
        <div className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-neutral-100 dark:bg-neutral-800">
          {q.type === 'coding'
            ? <Code2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            : <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              {q.title}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFF_STYLES[q.difficulty]}`}>
              {q.difficulty}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_STYLES[q.type]}`}>
              {q.type}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {q.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {q.companies.map((c) => <CompanyBadge key={c} name={c} />)}
            <span className="text-xs text-neutral-400 dark:text-neutral-500 self-center">{q.topic}</span>
          </div>
        </div>

        <div className="shrink-0 mt-1">
          {expanded
            ? <ChevronUp className="h-4 w-4 text-neutral-400" />
            : <ChevronDown className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors" />
          }
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-1 ms-11">
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4">
            {q.type === 'theory' && q.answer && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">Answer</p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                  {q.answer}
                </p>
              </div>
            )}
            {q.type === 'coding' && (
              <div className="space-y-4">
                {q.hint && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">Hint</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{q.hint}</p>
                  </div>
                )}
                {q.starterCode && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">Starter code</p>
                    <pre className="bg-neutral-900 dark:bg-neutral-950 text-neutral-100 rounded-lg px-4 py-3 text-xs overflow-x-auto font-mono leading-relaxed">
                      {q.starterCode}
                    </pre>
                  </div>
                )}
                <Link
                  href={`/playground?code=${encodeURIComponent(q.starterCode ?? '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-neutral-900 hover:opacity-90 transition-opacity"
                  style={{ background: LIME }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in Playground
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const ALL_COMPANIES = Array.from(new Set(questions.flatMap((q) => q.companies))).sort()
const ALL_TOPICS = Array.from(new Set(questions.map((q) => q.topic))).sort()

export function QuestionsContent() {
  const [activeCompany, setActiveCompany] = useState<string>('all')
  const [activeType, setActiveType] = useState<QuestionType | 'all'>('all')
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | 'all'>('all')
  const [activeTopic, setActiveTopic] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = questions.filter((q) => {
    if (activeCompany !== 'all' && !q.companies.includes(activeCompany)) return false
    if (activeType !== 'all' && q.type !== activeType) return false
    if (activeDifficulty !== 'all' && q.difficulty !== activeDifficulty) return false
    if (activeTopic !== 'all' && q.topic !== activeTopic) return false
    return true
  })

  const codingCount = filtered.filter((q) => q.type === 'coding').length
  const theoryCount = filtered.filter((q) => q.type === 'theory').length

  function pill(
    label: string,
    active: boolean,
    onClick: () => void,
    colorClass?: string,
  ) {
    return (
      <button
        key={label}
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap ${
          active
            ? colorClass ?? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent'
            : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 w-full">
      {/* Header */}
      <div className="mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
          Interview Prep
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral-900 dark:text-white mb-4">
          Famous Company{' '}
          <span className="text-neutral-400 dark:text-neutral-500">Interview Questions</span>
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl">
          Coding challenges and theoretical questions asked at top tech companies — with hints, solutions, and a live playground.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400 mb-8 pb-8 border-b border-neutral-100 dark:border-neutral-800">
        <span><strong className="text-neutral-900 dark:text-neutral-100">{filtered.length}</strong> questions</span>
        <span className="flex items-center gap-1.5">
          <Code2 className="h-3.5 w-3.5 text-purple-500" /> {codingCount} coding
        </span>
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5 text-blue-500" /> {theoryCount} theory
        </span>
        <span>{ALL_COMPANIES.length} companies</span>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        {/* Company */}
        <div className="flex items-start gap-3 flex-wrap">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mt-2 shrink-0 w-16">Company</span>
          <div className="flex flex-wrap gap-2">
            {pill('All', activeCompany === 'all', () => setActiveCompany('all'))}
            {ALL_COMPANIES.map((c) => pill(
              c,
              activeCompany === c,
              () => setActiveCompany(activeCompany === c ? 'all' : c),
              activeCompany === c ? `${COMPANY_COLORS[c] ?? ''} border-transparent` : undefined,
            ))}
          </div>
        </div>

        {/* Type + Difficulty */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest shrink-0">Type</span>
            {pill('All', activeType === 'all', () => setActiveType('all'))}
            {pill('Coding', activeType === 'coding', () => setActiveType(activeType === 'coding' ? 'all' : 'coding'))}
            {pill('Theory', activeType === 'theory', () => setActiveType(activeType === 'theory' ? 'all' : 'theory'))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest shrink-0">Level</span>
            {pill('All', activeDifficulty === 'all', () => setActiveDifficulty('all'))}
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) =>
              pill(d[0].toUpperCase() + d.slice(1), activeDifficulty === d, () => setActiveDifficulty(activeDifficulty === d ? 'all' : d))
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest shrink-0">Topic</span>
            {pill('All', activeTopic === 'all', () => setActiveTopic('all'))}
            {ALL_TOPICS.map((tp) => pill(tp, activeTopic === tp, () => setActiveTopic(activeTopic === tp ? 'all' : tp)))}
          </div>
        </div>
      </div>

      {/* Question list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-400 dark:text-neutral-600">
          <p className="text-lg font-semibold">No questions match your filters</p>
          <button
            onClick={() => { setActiveCompany('all'); setActiveType('all'); setActiveDifficulty('all'); setActiveTopic('all') }}
            className="mt-3 text-sm underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden">
          {filtered.map((q) => (
            <QuestionRow
              key={q.id}
              q={q}
              expanded={expandedId === q.id}
              onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
            />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center border-t border-neutral-100 dark:border-neutral-800 pt-12">
        <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mb-3">
          Ready to practice?
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6 text-sm">
          Open the free playground and start solving right now — no setup required.
        </p>
        <Link
          href="/playground"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-neutral-900 hover:opacity-90 transition-opacity"
          style={{ background: LIME }}
        >
          Open Playground <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  )
}
