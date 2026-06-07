'use client'

import { useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { SandpackPreview } from '@codesandbox/sandpack-react'
import { ChevronUp } from 'lucide-react'
import { EditorPanel } from '@/components/atoms/editor-panel/editor-panel'
import { PreviewPanel } from '@/components/atoms/preview-panel/preview-panel'
import { ConsolePanel } from '@/components/atoms/console-panel/console-panel'
import { TestResultsPanel } from '@/components/organisms/test-results-panel/test-results-panel'
import { Toolbar } from '@/components/molecules/toolbar/toolbar'

type Props = {
  instructions?: React.ReactNode
  hasTestFile?: boolean
  isReact?: boolean
  template?: string
  showRunButton?: boolean
  onTestResult?: (passed: boolean) => void
}

function PlaygroundLayout({ instructions, hasTestFile, isReact, template, showRunButton, onTestResult }: Props) {
  // React right panel tab
  const [reactTab, setReactTab] = useState<'browser' | 'console' | 'tests'>('browser')
  // JS bottom test drawer
  const [jsTestsOpen, setJsTestsOpen] = useState(false)

  // Called by Toolbar when Run Tests is clicked — opens the relevant results area
  function handleRunTests() {
    if (isReact) setReactTab('tests')
    else setJsTestsOpen(true)
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Execution iframe for vanilla-ts — required for console.log capture.
          Without SandpackPreview mounted the bundler compiles but nothing runs. */}
      {!isReact && (
        <div className="sr-only absolute" aria-hidden>
          <SandpackPreview showNavigator={false} showOpenInCodeSandbox={false} />
        </div>
      )}

      {/* Main resizable panels */}
      <div className="flex-1 min-h-0">
        <Group orientation="horizontal" className="h-full">
          {instructions && (
            <>
              <Panel defaultSize={28} minSize={15}>
                <div className="h-full overflow-auto p-4 prose prose-sm dark:prose-invert max-w-none">
                  {instructions}
                </div>
              </Panel>
              <Separator className="w-1 bg-border hover:bg-primary/40 transition-colors cursor-col-resize" />
            </>
          )}

          {/* Code editor */}
          <Panel
            defaultSize={isReact ? (instructions ? 40 : 68) : (instructions ? 72 : 100)}
            minSize={20}
          >
            <EditorPanel />
          </Panel>

          {/* React: right panel with Browser / Console / Tests tabs */}
          {isReact && (
            <>
              <Separator className="w-1 bg-border hover:bg-primary/40 transition-colors cursor-col-resize" />
              <Panel defaultSize={32} minSize={20}>
                <div className="flex flex-col h-full">
                  {/* Tab strip */}
                  <div className="flex items-center border-b border-border bg-muted/20 shrink-0">
                    {(['browser', 'console', ...(hasTestFile ? ['tests'] : [])] as string[]).map((id) => (
                      <button
                        key={id}
                        onClick={() => setReactTab(id as typeof reactTab)}
                        className={`px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
                          reactTab === id
                            ? 'border-foreground text-foreground'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {id === 'browser' ? 'Browser' : id === 'console' ? 'Console' : 'Tests'}
                      </button>
                    ))}
                  </div>

                  {/* Tab content — all panels stay mounted; only visibility changes.
                      PreviewPanel must stay mounted (visibility:hidden) or its iframe resets. */}
                  <div className="flex-1 min-h-0 relative">
                    <div className={`absolute inset-0 ${reactTab !== 'browser' ? 'invisible pointer-events-none' : ''}`}>
                      <PreviewPanel />
                    </div>
                    <div className={`absolute inset-0 overflow-hidden ${reactTab !== 'console' ? 'hidden' : ''}`}>
                      <ConsolePanel />
                    </div>
                    {hasTestFile && (
                      <div className={`absolute inset-0 overflow-hidden ${reactTab !== 'tests' ? 'hidden' : ''}`}>
                        <TestResultsPanel />
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            </>
          )}
        </Group>
      </div>

      {/* JS: collapsible test results drawer */}
      {!isReact && hasTestFile && (
        <>
          {jsTestsOpen && (
            <div className="border-t border-border shrink-0 overflow-hidden" style={{ height: 220 }}>
              <TestResultsPanel />
            </div>
          )}
          <button
            onClick={() => setJsTestsOpen((o) => !o)}
            className="flex items-center justify-between w-full px-3 py-2 border-t border-border bg-muted/30 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors shrink-0"
          >
            <span>Run tests / Console</span>
            <ChevronUp
              className={`h-3.5 w-3.5 transition-transform duration-200 ${jsTestsOpen ? '' : 'rotate-180'}`}
            />
          </button>
        </>
      )}

      {/* Bottom action bar */}
      <Toolbar
        hasTestFile={hasTestFile}
        isReact={isReact}
        template={template}
        showRunButton={showRunButton}
        onTestResult={onTestResult}
        onRunTests={handleRunTests}
      />
    </div>
  )
}

export { PlaygroundLayout }
