'use client'

import { useCallback } from 'react'
import { markComplete } from '@/lib/progress/store'
import { PlaygroundRoot } from '@/components/providers/playground-root/playground-root'
import { PlaygroundLayout } from '@/components/organisms/playground-layout/playground-layout'
import type { SandpackTemplate, PlaygroundConfig } from '@/lib/content/types'

type Props = {
  lessonId: string
  template?: SandpackTemplate
  files: Record<string, string>
  hiddenFiles?: string[]
  testFile?: string
  solutionFiles?: Record<string, string>
  playgroundConfig?: PlaygroundConfig
  instructions?: React.ReactNode
}

const REACT_RUNNER_BASE = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
`

function buildVanillaTsRunner(testFile: string): string {
  const destructures: string[] = []
  let code = testFile

  code = code.replace(/^import\s+type\s+\{[^}]*\}\s+from\s+['"]\.\/index['"]\s*;?\s*$/gm, '')

  code = code.replace(
    /^import\s+\{([^}]+)\}\s+from\s+['"]\.\/index['"]\s*;?\s*$/gm,
    (_, bindings: string) => { destructures.push(`const { ${bindings.trim()} } = __m`); return '' }
  )

  code = code.replace(
    /^import\s+(\w+)\s+from\s+['"]\.\/index['"]\s*;?\s*$/gm,
    (_, name: string) => { destructures.push(`const ${name} = (__m as any).default ?? __m`); return '' }
  )

  return `import * as __m_ns from './solution'
const __m = __m_ns as any
${destructures.join('\n')}
${code.trim()}
`
}

function LessonPlayground({
  lessonId,
  template,
  files,
  hiddenFiles = [],
  testFile,
  solutionFiles,
  playgroundConfig,
  instructions,
}: Props) {
  const handleTestResult = useCallback(
    (passed: boolean) => {
      if (passed) markComplete(lessonId)
    },
    [lessonId]
  )

  const isReact = template === 'react-ts'

  const runnerFile = isReact ? '/index.tsx' : '/index.ts'
  const activeFile = isReact ? '/App.tsx' : (testFile ? '/solution.ts' : '/index.ts')

  const runnerContent = testFile
    ? isReact
      ? `${REACT_RUNNER_BASE}setTimeout(() => {\n${testFile}\n}, 1000)\n`
      : buildVanillaTsRunner(testFile)
    : REACT_RUNNER_BASE

  const userSolutionCode = !isReact && testFile
    ? (files['/index.ts'] ?? files['index.ts'] ?? '')
    : undefined

  const allFiles = testFile
    ? {
        ...files,
        '/__tests__.ts': isReact
          ? testFile
          : testFile.replace(/from\s+['"]\.\/index['"]/g, "from './solution'"),
        [runnerFile]: runnerContent,
        ...(userSolutionCode !== undefined ? { '/solution.ts': userSolutionCode } : {}),
      }
    : files

  const allHiddenFiles = testFile ? [...hiddenFiles, runnerFile] : hiddenFiles
  const readOnlyFiles = testFile ? ['/__tests__.ts'] : []

  return (
    <div className="h-full">
      <PlaygroundRoot
        template={template}
        files={allFiles}
        hiddenFiles={allHiddenFiles}
        readOnlyFiles={readOnlyFiles}
        playgroundConfig={playgroundConfig}
        activeFile={activeFile}
        autorun={!testFile}
      >
        <PlaygroundLayout
          instructions={instructions}
          hasTestFile={!!testFile}
          isReact={isReact}
          template={template}
          solutionFiles={solutionFiles}
          playgroundConfig={playgroundConfig}
          onTestResult={handleTestResult}
        />
      </PlaygroundRoot>
    </div>
  )
}

export { LessonPlayground }
