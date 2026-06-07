'use client'

import { Group, Panel, Separator } from 'react-resizable-panels'
import { SandpackPreview } from '@codesandbox/sandpack-react'
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
  return (
    <div className="flex flex-col h-full relative">
      {/* Vanilla-ts needs a mounted SandpackPreview to create the execution iframe.
          Without it the bundler compiles the code but nothing runs and console.log
          is never captured by useSandpackConsole. */}
      {!isReact && (
        <div className="sr-only absolute" aria-hidden>
          <SandpackPreview showNavigator={false} showOpenInCodeSandbox={false} />
        </div>
      )}
      <Toolbar
        hasTestFile={hasTestFile}
        isReact={isReact}
        template={template}
        showRunButton={showRunButton}
        onTestResult={onTestResult}
      />
      <div className="flex-1 min-h-0">
        <Group orientation="horizontal" className="h-full">
          {instructions && (
            <>
              <Panel defaultSize={25} minSize={15} className="overflow-auto">
                <div className="h-full overflow-auto p-4 prose prose-sm dark:prose-invert max-w-none">
                  {instructions}
                </div>
              </Panel>
              <Separator className="w-1 bg-border hover:bg-primary/40 transition-colors cursor-col-resize" />
            </>
          )}

          <Panel defaultSize={instructions ? 40 : 60} minSize={20}>
            <EditorPanel />
          </Panel>

          <Separator className="w-1 bg-border hover:bg-primary/40 transition-colors cursor-col-resize" />

          <Panel defaultSize={35} minSize={20}>
            <Group orientation="vertical" className="h-full">
              {/* Preview only shown for React lessons */}
              {isReact && (
                <>
                  <Panel defaultSize={55} minSize={20}>
                    <PreviewPanel />
                  </Panel>
                  <Separator className="h-1 bg-border hover:bg-primary/40 transition-colors cursor-row-resize" />
                </>
              )}

              <Panel defaultSize={isReact ? 45 : 100} minSize={20}>
                {hasTestFile ? (
                  <TestResultsPanel />
                ) : (
                  <ConsolePanel />
                )}
              </Panel>
            </Group>
          </Panel>
        </Group>
      </div>
    </div>
  )
}

export { PlaygroundLayout }
