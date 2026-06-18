'use client'

import { useState, useCallback } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
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
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true)
  const [solutionOpen, setSolutionOpen] = useState(false)

  const handleRunTests = useCallback(() => {
    setBottomTab('tests')
    setBottomPanelOpen(true)
  }, [])

  const handleConsoleClick = useCallback(() => {
    setBottomTab('console')
    setBottomPanelOpen(true)
  }, [])

  const showBottomTabs = showConsole || showTests

  return (
    <div className="flex flex-col h-full relative">
      {/* Hidden execution iframe for vanilla-ts — required for console.log capture */}
      {!isReact && (
        <div className="sr-only absolute" aria-hidden>
          <SandpackPreview showNavigator={false} showOpenInCodeSandbox={false} />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 min-h-0">
        <Group orientation="horizontal" className="h-full">
          {/* Instructions panel (lessons only) */}
          {instructions && (
            <>
              <Panel defaultSize={28} minSize={15} maxSize={45}>
                <div className="h-full overflow-auto p-4 prose prose-sm dark:prose-invert max-w-none">
                  {instructions}
                </div>
              </Panel>
              <Separator className="w-1 bg-border hover:bg-primary/40 transition-colors cursor-col-resize" />
            </>
          )}

          {/* Code editor */}
          <Panel
            defaultSize={showPreview ? (instructions ? 38 : 55) : (instructions ? 72 : 100)}
            minSize={20}
          >
            <EditorPanel testCodeVisible={testCodeVisible} />
          </Panel>

          {/* Preview panel (React only) */}
          {showPreview && (
            <>
              <Separator className="w-1 bg-border hover:bg-primary/40 transition-colors cursor-col-resize" />
              <Panel defaultSize={instructions ? 34 : 45} minSize={20}>
                <PreviewPanel />
              </Panel>
            </>
          )}
        </Group>
      </div>

      {/* Bottom panel — Console / Tests tabs */}
      {showBottomTabs && (
        <div className="border-t border-border shrink-0" style={{ height: bottomPanelOpen ? 200 : 36 }}>
          {/* Tab strip */}
          <div className="flex items-center h-9 border-b border-border bg-muted/20 shrink-0">
            {showConsole && (
              <button
                onClick={() => { setBottomTab('console'); setBottomPanelOpen(true) }}
                className={`px-4 h-full text-xs font-medium border-b-2 -mb-px transition-colors ${
                  bottomTab === 'console' && bottomPanelOpen
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Console
              </button>
            )}
            {showTests && (
              <button
                onClick={() => { setBottomTab('tests'); setBottomPanelOpen(true) }}
                className={`px-4 h-full text-xs font-medium border-b-2 -mb-px transition-colors ${
                  bottomTab === 'tests' && bottomPanelOpen
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Tests
              </button>
            )}
            <div className="ms-auto flex items-center gap-1 px-2">
              <button
                onClick={() => setBottomPanelOpen((o) => !o)}
                className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title={bottomPanelOpen ? 'Collapse panel' : 'Expand panel'}
              >
                {bottomPanelOpen ? '▼' : '▲'}
              </button>
            </div>
          </div>

          {/* Tab content */}
          {bottomPanelOpen && (
            <div className="h-[calc(100%-36px)] overflow-hidden">
              {showConsole && (
                <div className={`h-full ${bottomTab !== 'console' ? 'hidden' : ''}`}>
                  <ConsolePanel />
                </div>
              )}
              {showTests && (
                <div className={`h-full ${bottomTab !== 'tests' ? 'hidden' : ''}`}>
                  <TestResultsPanel />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom toolbar */}
      <Toolbar
        hasTestFile={showTests}
        isReact={isReact}
        template={template}
        showRunButton={showRunButton}
        solutionFiles={solutionFiles}
        onTestResult={onTestResult}
        onRunTests={handleRunTests}
        onConsole={showConsole ? handleConsoleClick : undefined}
        onSolution={() => setSolutionOpen(true)}
      />

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
