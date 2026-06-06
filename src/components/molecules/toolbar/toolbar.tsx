'use client'

import { useSandpack, useSandpackConsole } from '@codesandbox/sandpack-react'
import { RotateCcw, Play, CheckCircle2, XCircle, Triangle } from 'lucide-react'
import { Button } from '@/components/atoms/button/button'
import { Badge } from '@/components/atoms/badge/badge'
import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import { useState, useEffect, useRef } from 'react'

const REACT_RUNNER_BASE = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
`

type Props = {
  hasTestFile?: boolean
  isReact?: boolean
  template?: string
  showRunButton?: boolean
  onTestResult?: (passed: boolean) => void
}

function Toolbar({ hasTestFile, isReact, template, showRunButton, onTestResult }: Props) {
  const { sandpack } = useSandpack()
  const { logs, reset: resetConsole } = useSandpackConsole({ resetOnPreviewRestart: true })
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'pass' | 'fail'>('idle')
  const prevLogsLengthRef = useRef(0)
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

    const runnerFile = isReact ? '/__test_runner__.tsx' : '/__test_runner__.ts'
    const fileData = sandpack.files['/__tests__.ts']
    const testCode = typeof fileData === 'string' ? fileData : (fileData as any)?.code ?? ''

    let runnerCode: string
    if (isReact) {
      const testBody = testCode
        .split('\n')
        .filter((l: string) => !l.trimStart().startsWith('import '))
        .join('\n')
        .trim()
      runnerCode = `${REACT_RUNNER_BASE}\nsetTimeout(() => {\n${testBody}\n}, 300)`
    } else {
      runnerCode = testCode
    }

    setTestStatus('running')
    resetConsole()
    sandpack.updateFile(runnerFile, runnerCode)
  }

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

  // Detect console reset (Sandpack re-ran) and reset status to running
  useEffect(() => {
    if (logs.length === 0 && prevLogsLengthRef.current > 0 && testStatus !== 'idle') {
      setTestStatus('running')
    }
    prevLogsLengthRef.current = logs.length
  }, [logs.length, testStatus])

  useEffect(() => {
    if (logs.length === 0) return
    for (const log of logs) {
      const text = log.data?.map((d) => (typeof d === 'string' ? d : JSON.stringify(d))).join(' ') ?? ''
      if (text.includes('✅')) {
        setTestStatus('pass')
        onTestResult?.(true)
        return
      }
      if (text.includes('❌') || text.toLowerCase().includes('error')) {
        setTestStatus('fail')
        onTestResult?.(false)
        return
      }
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
