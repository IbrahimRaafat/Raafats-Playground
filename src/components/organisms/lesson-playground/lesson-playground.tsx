'use client'

import { useCallback } from 'react'
import { markComplete } from '@/lib/progress/store'
import { PlaygroundRoot } from '@/components/providers/playground-root/playground-root'
import { PlaygroundLayout } from '@/components/organisms/playground-layout/playground-layout'
import type { SandpackTemplate } from '@/lib/content/types'

type Props = {
  lessonId: string
  template?: SandpackTemplate
  files: Record<string, string>
  hiddenFiles?: string[]
  testFile?: string
  instructions?: React.ReactNode
}

const REACT_RUNNER_BASE = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
`

function LessonPlayground({ lessonId, template, files, hiddenFiles = [], testFile, instructions }: Props) {
  const handleTestResult = useCallback(
    (passed: boolean) => {
      if (passed) markComplete(lessonId)
    },
    [lessonId]
  )

  const isReact = template === 'react-ts'
  const runnerFile = isReact ? '/__test_runner__.tsx' : '/__test_runner__.ts'
  const activeFile = isReact ? '/App.tsx' : '/index.ts'

  // Pre-populate runner with full test code so no re-bundle is needed on "Run Tests".
  // Tests run automatically on every code change (watch mode); button just forces a refresh.
  const runnerContent = testFile
    ? isReact
      ? `${REACT_RUNNER_BASE}\n${testFile}`
      : testFile
    : isReact
      ? REACT_RUNNER_BASE
      : `import './index'\n`

  // For vanilla-ts: override index.html to load the test runner.
  // The default template HTML has <script src="index.ts">, which loads the user's file
  // instead of the test runner. Overriding it ensures the runner actually executes.
  const runnerHtml =
    !isReact && testFile
      ? `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body><script src="${runnerFile.slice(1)}"></script></body></html>`
      : undefined

  const allFiles = testFile
    ? {
        ...files,
        '/__tests__.ts': testFile,
        [runnerFile]: runnerContent,
        ...(runnerHtml ? { '/index.html': runnerHtml } : {}),
      }
    : files

  const allHiddenFiles = testFile
    ? [...hiddenFiles, runnerFile, ...(runnerHtml ? ['/index.html'] : [])]
    : hiddenFiles
  const readOnlyFiles = testFile ? ['/__tests__.ts'] : []
  const customSetup = testFile ? { entry: runnerFile } : undefined

  return (
    <PlaygroundRoot
      template={template}
      files={allFiles}
      hiddenFiles={allHiddenFiles}
      readOnlyFiles={readOnlyFiles}
      customSetup={customSetup}
      activeFile={activeFile}
    >
      <PlaygroundLayout
        instructions={instructions}
        hasTestFile={!!testFile}
        isReact={isReact}
        template={template}
        onTestResult={handleTestResult}
      />
    </PlaygroundRoot>
  )
}

export { LessonPlayground }
