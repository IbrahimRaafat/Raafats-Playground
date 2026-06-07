'use client'

import { useSandpack, useSandpackConsole } from '@codesandbox/sandpack-react'
import { RotateCcw, Play, CheckCircle2, XCircle, Triangle } from 'lucide-react'
import { Button } from '@/components/atoms/button/button'
import { Badge } from '@/components/atoms/badge/badge'
import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import { useState, useEffect, useRef } from 'react'

type Props = {
  hasTestFile?: boolean
  isReact?: boolean
  template?: string
  showRunButton?: boolean
  onTestResult?: (passed: boolean) => void
}

function Toolbar({ hasTestFile, showRunButton, onTestResult }: Props) {
  const { sandpack } = useSandpack()
  const { logs, reset: resetConsole } = useSandpackConsole({ resetOnPreviewRestart: true })
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'pass' | 'fail'>('idle')
  const prevLogsLengthRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // True only while a user-triggered run is in flight — prevents auto-run log-clears
  // from overwriting a stable 'pass'/'fail' result with a stuck 'running' state.
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
    manualRunActiveRef.current = true
    setTestStatus('running')
    resetConsole()
    // Runner already has the test code — just refresh the already-compiled bundle (instant).
    sandpack.runSandpack()

    // Auto-fail safety net (only for manually-triggered runs)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      manualRunActiveRef.current = false
      setTestStatus((prev) => (prev === 'running' ? 'fail' : prev))
    }, 30000)
  }

  // Clear timeout on unmount
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

  // When logs are cleared by a preview restart, reset badge to 'running' only if the
  // user explicitly clicked Run Tests. Auto-reruns (code edits) should keep the last
  // known result visible until new results arrive — avoids a permanent stuck 'running'.
  useEffect(() => {
    if (logs.length === 0 && prevLogsLengthRef.current > 0 && manualRunActiveRef.current) {
      setTestStatus('running')
    }
    prevLogsLengthRef.current = logs.length
  }, [logs.length])

  useEffect(() => {
    if (logs.length === 0) return
    // Collect all log texts
    const texts = logs.map((log) =>
      log.data?.map((d) => (typeof d === 'string' ? d : JSON.stringify(d))).join(' ').trim() ?? ''
    )
    // Look for a summary line first (named test format)
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
    // Fallback: first ✅ / ❌ wins (old single-result format)
    for (const text of texts) {
      if (text.startsWith('✅')) { resolve(true); return }
      if (text.startsWith('❌')) { resolve(false); return }
    }
  }, [logs, onTestResult])

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
      <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5">
        <RotateCcw className="h-3.5 w-3.5" />
        {t('toolbar.reset')}
      </Button>

      {showRunButton && !hasTestFile && (
        <Button variant="default" size="sm" onClick={handleRun} className="gap-1.5">
          <Triangle className="h-3 w-3 fill-current" />
          {t('toolbar.run')}
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
          <Play className="h-3.5 w-3.5" />
          {t('toolbar.runTests')}
        </Button>
      )}

      {testStatus === 'pass' && (
        <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-600">
          <CheckCircle2 className="h-3 w-3" />
          {t('test.passed')}
        </Badge>
      )}
      {testStatus === 'fail' && (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          {t('test.failed')}
        </Badge>
      )}
    </div>
  )
}

export { Toolbar }
