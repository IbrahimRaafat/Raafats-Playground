'use client'

import { useSandpack, useSandpackConsole } from '@codesandbox/sandpack-react'
import { RotateCcw, Play, CheckCircle2, XCircle, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/atoms/button/button'
import { Badge } from '@/components/atoms/badge/badge'
import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import { useState, useEffect, useRef } from 'react'

type Props = {
  hasTestFile?: boolean
  isReact?: boolean
  template?: string
  showRunButton?: boolean
  solutionFiles?: Record<string, string>
  onTestResult?: (passed: boolean) => void
  onRunTests?: () => void
  onSolution?: () => void
}

function Toolbar({ hasTestFile, showRunButton, solutionFiles, onTestResult, onRunTests, onSolution }: Props) {
  const { sandpack } = useSandpack()
  const { logs, reset: resetConsole } = useSandpackConsole({ resetOnPreviewRestart: true })
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'pass' | 'fail'>('idle')
  const prevLogsLengthRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const manualRunActiveRef = useRef(false)
  const { t } = useTranslation()

  function handleReset() {
    sandpack.resetAllFiles()
    setTestStatus('idle')
  }

  function handleRun() {
    sandpack.runSandpack()
  }

  function handleRunTests() {
    if (!hasTestFile) return
    onRunTests?.()
    manualRunActiveRef.current = true
    setTestStatus('running')
    resetConsole()
    sandpack.runSandpack()

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      manualRunActiveRef.current = false
      setTestStatus((prev) => (prev === 'running' ? 'fail' : prev))
    }, 30000)
  }

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  const runActionRef = useRef<() => void>(() => {})
  useEffect(() => {
    runActionRef.current = hasTestFile ? handleRunTests : showRunButton ? handleRun : () => {}
  })

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runActionRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (logs.length === 0 && prevLogsLengthRef.current > 0 && manualRunActiveRef.current) {
      setTestStatus('running')
    }
    prevLogsLengthRef.current = logs.length
  }, [logs.length])

  useEffect(() => {
    if (logs.length === 0) return
    const texts = logs.map((log) =>
      log.data?.map((d) => (typeof d === 'string' ? d : JSON.stringify(d))).join(' ').trim() ?? ''
    )
    const summaryPass = texts.find((t) => t.includes('All tests passed'))
    const summaryFail = texts.find((t) => t.includes('test(s) failed') || t.includes('tests failed'))
    const resolve = (passed: boolean) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      manualRunActiveRef.current = false
      setTestStatus(passed ? 'pass' : 'fail')
      onTestResult?.(passed)
    }
    if (summaryPass) { resolve(true); return }
    if (summaryFail) { resolve(false); return }
    for (const text of texts) {
      if (text.startsWith('✅')) { resolve(true); return }
      if (text.startsWith('❌')) { resolve(false); return }
    }
  }, [logs, onTestResult])

  return (
    <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/20 shrink-0 gap-2">
      {/* Left: Reset */}
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          {t('toolbar.reset')}
        </Button>
      </div>

      {/* Center: Test status badge */}
      <div className="flex items-center gap-2">
        {testStatus === 'pass' && (
          <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-600 animate-in fade-in duration-300">
            <CheckCircle2 className="h-3 w-3" />
            {t('test.passed')}
          </Badge>
        )}
        {testStatus === 'fail' && (
          <Badge variant="destructive" className="gap-1 animate-in fade-in duration-300">
            <XCircle className="h-3 w-3" />
            {t('test.failed')}
          </Badge>
        )}
      </div>

      {/* Right: Solution + Run buttons */}
      <div className="flex items-center gap-1.5">
        {solutionFiles && (
          <Button variant="ghost" size="sm" onClick={onSolution} className="gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            Solution
          </Button>
        )}

        {hasTestFile && (
          <Button
            variant="default"
            size="sm"
            onClick={handleRunTests}
            disabled={testStatus === 'running'}
            className="gap-1.5"
          >
            {testStatus === 'running' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            {t('toolbar.runTests')}
            <kbd className="hidden sm:inline text-[9px] opacity-60 font-mono ml-1">⌘↵</kbd>
          </Button>
        )}

        {showRunButton && !hasTestFile && (
          <Button variant="default" size="sm" onClick={handleRun} className="gap-1.5">
            <Play className="h-3.5 w-3.5 fill-current" />
            {t('toolbar.run')}
          </Button>
        )}
      </div>
    </div>
  )
}

export { Toolbar }
