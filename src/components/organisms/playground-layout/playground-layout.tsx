'use client'

import { useState, useCallback, useRef } from 'react'
import { SandpackPreview } from '@codesandbox/sandpack-react'
import { EditorPanel } from '@/components/atoms/editor-panel/editor-panel'
import { PreviewPanel } from '@/components/atoms/preview-panel/preview-panel'
import { ConsolePanel } from '@/components/atoms/console-panel/console-panel'
import { TestResultsPanel } from '@/components/organisms/test-results-panel/test-results-panel'
import { Toolbar } from '@/components/molecules/toolbar/toolbar'
import { SolutionDrawer } from '@/components/molecules/solution-drawer/solution-drawer'
import type { PlaygroundConfig } from '@/lib/content/types'

type BottomTab = 'console' | 'tests'

type Props = {
  instructions?: React.ReactNode
  hasTestFile?: boolean
  isReact?: boolean
  template?: string
  showRunButton?: boolean
  solutionFiles?: Record<string, string>
  playgroundConfig?: PlaygroundConfig
  onTestResult?: (passed: boolean) => void
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
  const showConsole = playgroundConfig?.showConsole ?? true
  const showTests = playgroundConfig?.showTests ?? hasTestFile
  const testCodeVisible = playgroundConfig?.testCodeVisible ?? true

  const [bottomTab, setBottomTab] = useState<BottomTab>(showTests ? 'tests' : 'console')
  const [solutionOpen, setSolutionOpen] = useState(false)

  // Resizable split: instructions vs editor+console
  const [leftWidth, setLeftWidth] = useState(30)
  const leftDragRef = useRef<{ x: number; w: number } | null>(null)

  // Resizable split: editor vs console
  const [topRatio, setTopRatio] = useState(65)
  const vertDragRef = useRef<{ y: number; ratio: number } | null>(null)

  const handleRunTests = useCallback(() => {
    setBottomTab('tests')
  }, [])

  const handleConsoleClick = useCallback(() => {
    setBottomTab('console')
  }, [])

  const showBottomTabs = showConsole || showTests

  // Horizontal drag (instructions ↔ editor)
  function onLeftDragStart(e: React.MouseEvent) {
    e.preventDefault()
    const container = (e.currentTarget as HTMLElement).parentElement!
    leftDragRef.current = { x: e.clientX, w: container.clientWidth }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    function onMove(ev: MouseEvent) {
      if (!leftDragRef.current) return
      const pct = ((ev.clientX) / leftDragRef.current.w) * 100
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

  // Vertical drag (editor ↔ console)
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Hidden execution iframe for vanilla-ts */}
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
            {/* Vertical separator */}
            <div
              onMouseDown={onLeftDragStart}
              style={{ width: 4, cursor: 'col-resize', background: 'var(--border)', flexShrink: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--border)')}
            />
          </>
        )}

        {/* RIGHT: Editor (top) + Console/Tests (bottom) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Editor */}
          <div style={{ flex: `${topRatio} 1 0%`, minHeight: 100, overflow: 'hidden' }}>
            <EditorPanel testCodeVisible={testCodeVisible} />
          </div>

          {/* Horizontal separator */}
          {showBottomTabs && (
            <>
              <div
                onMouseDown={onVertDragStart}
                style={{ height: 4, cursor: 'row-resize', background: 'var(--border)', flexShrink: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--border)')}
              />
              {/* Bottom: Console / Tests */}
              <div style={{ flex: `${100 - topRatio} 1 0%`, minHeight: 80, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Tab strip */}
                <div style={{ display: 'flex', alignItems: 'center', height: 32, borderBottom: '1px solid var(--border)', background: 'var(--muted)', paddingLeft: 12, flexShrink: 0 }}>
                  {showConsole && (
                    <button
                      onClick={() => setBottomTab('console')}
                      style={{
                        padding: '0 12px',
                        height: '100%',
                        fontSize: 12,
                        fontWeight: 500,
                        borderBottom: bottomTab === 'console' ? '2px solid var(--foreground)' : '2px solid transparent',
                        color: bottomTab === 'console' ? 'var(--foreground)' : 'var(--muted-foreground)',
                        background: 'none',
                        border: 'none',
                        borderBottomWidth: 2,
                        borderBottomStyle: 'solid',
                        borderBottomColor: bottomTab === 'console' ? 'var(--foreground)' : 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      Console
                    </button>
                  )}
                  {showTests && (
                    <button
                      onClick={() => setBottomTab('tests')}
                      style={{
                        padding: '0 12px',
                        height: '100%',
                        fontSize: 12,
                        fontWeight: 500,
                        background: 'none',
                        border: 'none',
                        borderBottomWidth: 2,
                        borderBottomStyle: 'solid',
                        borderBottomColor: bottomTab === 'tests' ? 'var(--foreground)' : 'transparent',
                        color: bottomTab === 'tests' ? 'var(--foreground)' : 'var(--muted-foreground)',
                        cursor: 'pointer',
                      }}
                    >
                      Tests
                    </button>
                  )}
                </div>

                {/* Tab content */}
                <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                  {showConsole && (
                    <div style={{ height: '100%', display: bottomTab !== 'console' ? 'none' : 'block' }}>
                      <ConsolePanel />
                    </div>
                  )}
                  {showTests && (
                    <div style={{ height: '100%', display: bottomTab !== 'tests' ? 'none' : 'block' }}>
                      <TestResultsPanel />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Preview (React only) — rightmost column */}
        {showPreview && (
          <>
            <div style={{ width: 4, cursor: 'col-resize', background: 'var(--border)', flexShrink: 0 }} />
            <div style={{ flex: '0 0 30%', minWidth: 200 }}>
              <PreviewPanel />
            </div>
          </>
        )}
      </div>

      {/* Bottom toolbar */}
      <div style={{ flexShrink: 0 }}>
        <Toolbar
          hasTestFile={showTests}
          isReact={isReact}
          template={template}
          showRunButton={showRunButton}
          solutionFiles={solutionFiles}
          onTestResult={onTestResult}
          onRunTests={handleRunTests}
          onSolution={() => setSolutionOpen(true)}
        />
      </div>

      {/* Solution drawer */}
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
