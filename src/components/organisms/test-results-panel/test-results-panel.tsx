'use client'

import { useSandpackConsole } from '@codesandbox/sandpack-react'
import { CheckCircle2, XCircle, Clock, Trophy } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

type TestCase = {
  status: 'pass' | 'fail'
  name: string
  reason?: string
}

function parseTestCases(logs: ReturnType<typeof useSandpackConsole>['logs']): TestCase[] {
  const cases: TestCase[] = []
  for (const log of logs) {
    const text = log.data
      ?.map((d) => (typeof d === 'string' ? d : JSON.stringify(d)))
      .join(' ')
      .trim()
    if (!text) continue

    if (text.startsWith('✅')) {
      const name = text.replace(/^✅\s*/, '').trim()
      if (name) cases.push({ status: 'pass', name })
    } else if (text.startsWith('❌')) {
      const rest = text.replace(/^❌\s*/, '').trim()
      const colonIdx = rest.indexOf(':')
      if (colonIdx !== -1) {
        cases.push({ status: 'fail', name: rest.slice(0, colonIdx).trim(), reason: rest.slice(colonIdx + 1).trim() })
      } else {
        cases.push({ status: 'fail', name: rest })
      }
    }
  }
  return cases
}

function TestResultsPanel() {
  const { logs } = useSandpackConsole({ resetOnPreviewRestart: true })
  const cases = parseTestCases(logs)
  const passCount = cases.filter((c) => c.status === 'pass').length
  const failCount = cases.filter((c) => c.status === 'fail').length
  const allPassed = cases.length > 0 && failCount === 0

  const [isRunning, setIsRunning] = useState(false)
  const [isBundling, setIsBundling] = useState(false)
  const prevLogsLenRef = useRef(0)
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prevLen = prevLogsLenRef.current
    prevLogsLenRef.current = logs.length

    if (logs.length === 0 && prevLen > 0) {
      setIsRunning(true)
      setIsBundling(true)
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = setTimeout(() => {
        setIsRunning(false)
        setIsBundling(false)
      }, 15_000)
    } else if (logs.length > 0) {
      setIsRunning(false)
      setIsBundling(false)
      if (safetyTimerRef.current) { clearTimeout(safetyTimerRef.current); safetyTimerRef.current = null }
    }
  }, [logs.length])

  // Auto-scroll to bottom when new results arrive
  useEffect(() => {
    if (listRef.current && cases.length > 0) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [cases.length])

  // Empty state — no tests run yet
  if (cases.length === 0 && !isRunning) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground text-xs p-4">
        <Clock className="h-6 w-6 opacity-30" />
        <div className="text-center">
          <p className="font-medium">No test results yet</p>
          <p className="opacity-70 mt-1">Click <strong>Run Tests</strong> or press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono">Ctrl+Enter</kbd></p>
        </div>
      </div>
    )
  }

  // Running state
  if (isRunning) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground text-xs p-4">
        <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <div className="text-center">
          <p className="font-medium text-foreground">
            {isBundling ? 'Bundling...' : 'Running tests...'}
          </p>
          <p className="opacity-70 mt-1">
            {isBundling ? 'First run may take a moment' : 'Evaluating your code'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Summary header */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-muted/30 text-xs font-medium shrink-0">
        {allPassed ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Trophy className="h-3.5 w-3.5" />
            <span>All {passCount} tests passed</span>
          </div>
        ) : (
          <>
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3" />
              {passCount} passed
            </span>
            {failCount > 0 && (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <XCircle className="h-3 w-3" />
                {failCount} failed
              </span>
            )}
          </>
        )}
      </div>

      {/* Test case list — auto-scrollable */}
      <div ref={listRef} className="flex-1 overflow-auto">
        {cases.map((c, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 px-3 py-2.5 border-b border-border/50 text-xs transition-colors ${
              c.status === 'pass'
                ? 'bg-green-50/40 dark:bg-green-950/20'
                : 'bg-red-50/40 dark:bg-red-950/20'
            }`}
          >
            {c.status === 'pass' ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span
                className={`font-medium ${
                  c.status === 'pass'
                    ? 'text-green-800 dark:text-green-300'
                    : 'text-red-800 dark:text-red-300'
                }`}
              >
                {c.name}
              </span>
              {c.reason && (
                <span className="text-muted-foreground text-[11px] leading-relaxed">{c.reason}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { TestResultsPanel }
