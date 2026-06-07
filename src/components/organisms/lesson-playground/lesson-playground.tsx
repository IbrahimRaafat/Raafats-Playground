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

// Build the vanilla-ts test runner that lives in /index.ts (Sandpack's natural
// default entry).  User's editable code lives in /solution.ts.
//
// Namespace import (`import * as ns`) never throws for missing named exports —
// it just gives an empty namespace — unlike `import { x }` which SyntaxErrors
// during the module link phase if `x` is not exported.
function buildVanillaTsRunner(testFile: string): string {
  const destructures: string[] = []
  let code = testFile

  // Drop type-only imports — erased at runtime
  code = code.replace(/^import\s+type\s+\{[^}]*\}\s+from\s+['"]\.\/index['"]\s*;?\s*$/gm, '')

  // Convert  import { x, y } from './index'  →  const { x, y } = __m
  code = code.replace(
    /^import\s+\{([^}]+)\}\s+from\s+['"]\.\/index['"]\s*;?\s*$/gm,
    (_, bindings: string) => { destructures.push(`const { ${bindings.trim()} } = __m`); return '' }
  )

  // Convert  import Foo from './index'  →  const Foo = __m.default ?? __m
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

function LessonPlayground({ lessonId, template, files, hiddenFiles = [], testFile, instructions }: Props) {
  const handleTestResult = useCallback(
    (passed: boolean) => {
      if (passed) markComplete(lessonId)
    },
    [lessonId]
  )

  const isReact = template === 'react-ts'

  // For react-ts: override /index.tsx (the template's own entry) — only one createRoot() call.
  // For vanilla-ts: runner goes in /index.ts (the template's natural Parcel entry).
  //   No entry overrides needed: Sandpack's getFiles() short-circuits when /package.json
  //   already exists (provided by the vanilla-ts template) and ignores customSetup.entry,
  //   so using the default /index.ts entry is the only reliable approach.
  const runnerFile = isReact ? '/index.tsx' : '/index.ts'
  const activeFile = isReact ? '/App.tsx' : (testFile ? '/solution.ts' : '/index.ts')

  const runnerContent = testFile
    ? isReact
      ? `${REACT_RUNNER_BASE}setTimeout(() => {\n${testFile}\n}, 1000)\n`
      : buildVanillaTsRunner(testFile)
    : REACT_RUNNER_BASE

  // For vanilla-ts with tests: user's starter code moves from index.ts → solution.ts.
  // The runner replaces /index.ts (Sandpack executes it by default).
  const userSolutionCode = !isReact && testFile
    ? (files['/index.ts'] ?? files['index.ts'] ?? '')
    : undefined

  const allFiles = testFile
    ? {
        ...files,
        // Show test file with './solution' refs so they match the actual editable file.
        // For react-ts, refs stay as-is (react tests don't import from './index').
        '/__tests__.ts': isReact
          ? testFile
          : testFile.replace(/from\s+['"]\.\/index['"]/g, "from './solution'"),
        [runnerFile]: runnerContent,
        ...(userSolutionCode !== undefined ? { '/solution.ts': userSolutionCode } : {}),
      }
    : files

  // Hide the runner file — users only see solution.ts + __tests__.ts
  const allHiddenFiles = testFile ? [...hiddenFiles, runnerFile] : hiddenFiles
  const readOnlyFiles = testFile ? ['/__tests__.ts'] : []

  return (
    <PlaygroundRoot
      template={template}
      files={allFiles}
      hiddenFiles={allHiddenFiles}
      readOnlyFiles={readOnlyFiles}
      activeFile={activeFile}
      autorun={!testFile}
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
