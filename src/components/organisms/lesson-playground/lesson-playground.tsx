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
  // For react-ts: override /index.tsx (the template's own entry) so there is only ONE
  // createRoot() call. Creating a second root on the same #root element throws in React 18
  // and kills the runner before any test output is produced.
  // For vanilla-ts: use a separate /__test_runner__.ts and override index.html to load it.
  const runnerFile = isReact ? '/index.tsx' : '/__test_runner__.ts'
  const activeFile = isReact ? '/App.tsx' : '/index.ts'

  // For react-ts: wrap DOM test code in setTimeout so React has time to paint before
  // any document.querySelector calls run (React renders asynchronously).
  const runnerContent = testFile
    ? isReact
      ? `${REACT_RUNNER_BASE}setTimeout(() => {\n${testFile}\n}, 500)\n`
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
  // For react-ts, /index.tsx is already the default entry — no customSetup needed.
  // For vanilla-ts, tell the bundler to start from /__test_runner__.ts.
  const customSetup = !isReact && testFile ? { entry: runnerFile } : undefined

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
