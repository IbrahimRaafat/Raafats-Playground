'use client'

import { useState, useRef } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { SandpackPreview } from '@codesandbox/sandpack-react'
import { RotateCcw, Eye } from 'lucide-react'
import { EditorPanel } from '@/components/atoms/editor-panel/editor-panel'
import { PreviewPanel } from '@/components/atoms/preview-panel/preview-panel'
import { TestResultsPanel } from '@/components/organisms/test-results-panel/test-results-panel'
import { SolutionDrawer } from '@/components/molecules/solution-drawer/solution-drawer'
import type { PlaygroundConfig } from '@/lib/content/types'

type Props = {
  instructions?: React.ReactNode
  hasTestFile?: boolean
  isReact?: boolean
  template?: string
  showRunButton?: boolean
  solutionFiles?: Record<string, string>
  playgroundConfig?: PlaygroundConfig
  onTestResult?: (passed: boolean) => void
  onReset?: () => void
}

function PlaygroundLayout({
  instructions,
  hasTestFile,
  isReact,
  template,
  showRunButton,
  solutionFiles,
  playgroundConfig,
  onTestResult,
}: Props) {
  const showPreview = playgroundConfig?.showPreview ?? isReact
  const showTests = playgroundConfig?.showTests ?? hasTestFile
  const testCodeVisible = playgroundConfig?.testCodeVisible ?? true
  const { sandpack } = useSandpack()

  const [solutionOpen, setSolutionOpen] = useState(false)

  const [leftWidth, setLeftWidth] = useState(30)
  const leftDragRef = useRef<{ x: number; w: number } | null>(null)

  const [topRatio, setTopRatio] = useState(65)
  const vertDragRef = useRef<{ y: number; ratio: number } | null>(null)

  function onLeftDragStart(e: React.MouseEvent) {
    e.preventDefault()
    const container = (e.currentTarget as HTMLElement).parentElement!
    leftDragRef.current = { x: e.clientX, w: container.clientWidth }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    function onMove(ev: MouseEvent) {
      if (!leftDragRef.current) return
      const pct = (ev.clientX / leftDragRef.current.w) * 100
      setLeftWidth(Math.max(15, Math.min(45, pct)))
    }
    function onUp() {
      leftDragRef.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  function onVertDragStart(e: React.MouseEvent) {
    e.preventDefault()
    const container = (e.currentTarget as HTMLElement).parentElement!
    vertDragRef.current = { y: e.clientY, ratio: topRatio }
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
    function onMove(ev: MouseEvent) {
      if (!vertDragRef.current) return
      const rect = container.getBoundingClientRect()
      const pct = ((ev.clientY - rect.top) / rect.height) * 100
      setTopRatio(Math.max(20, Math.min(85, pct)))
    }
    function onUp() {
      vertDragRef.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  function handleReset() {
    sandpack.resetAllFiles()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {!isReact && (
        <div className="sr-only absolute" aria-hidden>
          <SandpackPreview showNavigator={false} showOpenInCodeSandbox={false} />
        </div>
      )}

      {/* Main area */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* LEFT: Instructions */}
        {instructions && (
          <>
            <div style={{ width: `${leftWidth}%`, minWidth: 180, maxWidth: 500, overflow: 'auto', padding: 16 }} className="prose prose-sm dark:prose-invert max-w-none">
              {instructions}
            </div>
            <div
              onMouseDown={onLeftDragStart}
              style={{ width: 4, cursor: 'col-resize', background: 'var(--border)', flexShrink: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--border)')}
            />
          </>
        )}

        {/* RIGHT: Editor (top) + Test Results (bottom) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Editor with Reset + Solution buttons */}
          <div style={{ flex: `${topRatio} 1 0%`, minHeight: 100, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <EditorPanel testCodeVisible={testCodeVisible} actionButtons={
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingRight: 8 }}>
                {solutionFiles && (
                  <button
                    onClick={() => setSolutionOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: 11, color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4 }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Eye style={{ width: 12, height: 12 }} />
                    Solution
                  </button>
                )}
                <button
                  onClick={handleReset}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: 11, color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <RotateCcw style={{ width: 12, height: 12 }} />
                  Reset
                </button>
              </div>
            } />
          </div>

          {/* Bottom: Test Results */}
          {showTests && (
            <>
              <div
                onMouseDown={onVertDragStart}
                style={{ height: 4, cursor: 'row-resize', background: 'var(--border)', flexShrink: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--border)')}
              />
              <div style={{ flex: `${100 - topRatio} 1 0%`, minHeight: 80, overflow: 'hidden' }}>
                <TestResultsPanel />
              </div>
            </>
          )}
        </div>

        {/* Preview (React only) */}
        {showPreview && (
          <>
            <div style={{ width: 4, cursor: 'col-resize', background: 'var(--border)', flexShrink: 0 }} />
            <div style={{ flex: '0 0 30%', minWidth: 200 }}>
              <PreviewPanel />
            </div>
          </>
        )}
      </div>

      {solutionFiles && (
        <SolutionDrawer
          open={solutionOpen}
          onClose={() => setSolutionOpen(false)}
          files={solutionFiles}
        />
      )}
    </div>
  )
}

export { PlaygroundLayout }
