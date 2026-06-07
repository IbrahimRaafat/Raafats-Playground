'use client'

import { useSandpackConsole } from '@codesandbox/sandpack-react'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
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

  // Track running state locally — don't rely on sandpack.status which can stay 'running'
  // permanently while the hosted bundler is connecting on initial load.
  const [isRunning, setIsRunning] = useState(true) // autorun=true fires immediately
  const prevLogsLenRef = useRef(0)
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const prevLen = prevLogsLenRef.current
    prevLogsLenRef.current = logs.length

    if (logs.length === 0 && prevLen > 0) {
      // Logs cleared by preview restart — a new run is starting
      setIsRunning(true)
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = setTimeout(() => setIsRunning(false), 12_000)
    } else if (logs.length > 0) {
      // First log arrived — stop spinner
      setIsRunning(false)
      if (safetyTimerRef.current) { clearTimeout(safetyTimerRef.current); safetyTimerRef.current = null }
    }
  }, [logs.length])

  // Start a safety timer on mount for the initial autorun.
  // If the test runner never produces logs (e.g. bundler stuck), stop spinning after 12s.
  useEffect(() => {
    safetyTimerRef.current = setTimeout(() => setIsRunning(false), 12_000)
    return () => { if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current) }
  }, [])

  if (cases.length === 0 && isRunning) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs p-4">
        <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        <span>Running tests…</span>
      </div>
    )
  }

  if (cases.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs p-4">
        <Clock className="h-5 w-5 opacity-40" />
        <span>Click <strong>Run Tests</strong> to see results</span>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-muted/30 text-xs font-medium shrink-0">
        <span className="text-muted-foreground">Test Results</span>
        {cases.length > 0 && (
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
        {isRunning && <div className="ms-auto h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin text-muted-foreground" />}
      </div>

      {/* Test case list */}
      <div className="flex-1 overflow-auto">
        {cases.map((c, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 px-3 py-2.5 border-b border-border/50 text-xs ${
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
                <span className="text-muted-foreground truncate">{c.reason}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { TestResultsPanel }
