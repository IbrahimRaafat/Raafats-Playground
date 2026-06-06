'use client'

import { useSandpack, useSandpackConsole } from '@codesandbox/sandpack-react'
import { RotateCcw, Play, CheckCircle2, XCircle, Triangle } from 'lucide-react'
import { Button } from '@/components/atoms/button/button'
import { Badge } from '@/components/atoms/badge/badge'
import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import { useState, useEffect, useRef } from 'react'

const TEST_MARKER = '// ——tests——'

type Props = {
  testFile?: string
  template?: string
  showRunButton?: boolean
  onTestResult?: (passed: boolean) => void
}

function Toolbar({ testFile, template, showRunButton, onTestResult }: Props) {
  const { sandpack } = useSandpack()
  const { logs, reset: resetConsole } = useSandpackConsole({ resetOnPreviewRestart: false })
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'pass' | 'fail'>('idle')
  const entryFileRef = useRef<string>('/index.ts')
  const prevCodeRef = useRef<string>('')
  const { t } = useTranslation()

  function handleReset() {
    sandpack.resetAllFiles()
    setTestStatus('idle')
  }

  function handleRun() {
    sandpack.runSandpack()
  }

  function handleRunTests() {
    if (!testFile) return

    const entryFile = template === 'react-ts' ? '/App.tsx' : '/index.ts'
    entryFileRef.current = entryFile

    const currentFile = sandpack.files[entryFile]
    const currentCode = typeof currentFile === 'string' ? currentFile : currentFile?.code ?? ''

    const cleanCode = currentCode.includes(TEST_MARKER)
      ? currentCode.slice(0, currentCode.indexOf(TEST_MARKER)).trimEnd()
      : currentCode

    const testBody = testFile
      .split('\n')
      .filter((l) => !l.trimStart().startsWith('import '))
      .join('\n')
      .trim()

    const wrappedTest =
      template === 'react-ts'
        ? `setTimeout(() => {\n${testBody}\n}, 200)`
        : testBody

    prevCodeRef.current = cleanCode
    setTestStatus('running')
    resetConsole()
    sandpack.updateFile(entryFile, `${cleanCode}\n\n${TEST_MARKER}\n${wrappedTest}`)
  }

  // Keep a ref to the current run action so the keydown handler is stable
  const runActionRef = useRef<() => void>(() => {})
  useEffect(() => {
    runActionRef.current = testFile
      ? handleRunTests
      : showRunButton
      ? handleRun
      : () => {}
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
    if (testStatus !== 'running') return
    for (const log of logs) {
      const text = log.data?.map((d) => (typeof d === 'string' ? d : JSON.stringify(d))).join(' ') ?? ''
      if (text.includes('✅')) {
        setTestStatus('pass')
        onTestResult?.(true)
        sandpack.updateFile(entryFileRef.current, prevCodeRef.current)
        return
      }
      if (text.includes('❌') || text.toLowerCase().includes('error')) {
        setTestStatus('fail')
        onTestResult?.(false)
        sandpack.updateFile(entryFileRef.current, prevCodeRef.current)
        return
      }
    }
  }, [logs, testStatus, onTestResult, sandpack])

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
      <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5">
        <RotateCcw className="h-3.5 w-3.5" />
        {t('toolbar.reset')}
      </Button>

      {showRunButton && !testFile && (
        <Button variant="default" size="sm" onClick={handleRun} className="gap-1.5">
          <Triangle className="h-3 w-3 fill-current" />
          {t('toolbar.run')}
        </Button>
      )}

      {testFile && (
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
