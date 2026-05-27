'use client'

import { useSandpack } from '@codesandbox/sandpack-react'
import { RotateCcw, Play, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect, useRef } from 'react'

type Props = {
  testFile?: string
  onTestResult?: (passed: boolean) => void
}

export function Toolbar({ testFile, onTestResult }: Props) {
  const { sandpack } = useSandpack()
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'pass' | 'fail'>('idle')
  const originalFilesRef = useRef<Record<string, string>>({})

  function handleReset() {
    sandpack.resetAllFiles()
    setTestStatus('idle')
  }

  function handleRunTests() {
    if (!testFile) return
    setTestStatus('running')

    // Capture current user files before injecting test runner
    originalFilesRef.current = Object.fromEntries(
      Object.entries(sandpack.files).map(([k, v]) => [k, typeof v === 'string' ? v : v.code])
    )

    // Inject the test file and switch entry point
    sandpack.updateFile('/__tests__.ts', testFile)
    sandpack.updateCurrentFile('/__tests__.ts')
  }

  // Listen to console messages from the sandpack iframe via the listener
  useEffect(() => {
    if (testStatus !== 'running') return

    const handler = (event: MessageEvent) => {
      if (event.data?.type !== 'console') return
      const log: string = (event.data?.log ?? []).join(' ')
      if (log.includes('✅')) {
        setTestStatus('pass')
        onTestResult?.(true)
      } else if (log.includes('❌') || log.includes('Error')) {
        setTestStatus('fail')
        onTestResult?.(false)
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [testStatus, onTestResult])

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
      <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5">
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </Button>

      {testFile && (
        <Button
          variant="default"
          size="sm"
          onClick={handleRunTests}
          disabled={testStatus === 'running'}
          className="gap-1.5"
        >
          <Play className="h-3.5 w-3.5" />
          Run Tests
        </Button>
      )}

      {testStatus === 'pass' && (
        <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-600">
          <CheckCircle2 className="h-3 w-3" />
          All tests passed
        </Badge>
      )}
      {testStatus === 'fail' && (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Tests failed
        </Badge>
      )}
    </div>
  )
}
