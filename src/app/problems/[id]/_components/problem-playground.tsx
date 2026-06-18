'use client'

import { PlaygroundRoot } from '@/components/providers/playground-root/playground-root'
import { PlaygroundLayout } from '@/components/organisms/playground-layout/playground-layout'
import type { PlaygroundConfig, SandpackTemplate } from '@/lib/content/types'

type Props = {
  problemId: string
  title: string
  description: string
  sandpackTemplate: SandpackTemplate
  starterFiles: Record<string, string>
  solutionFiles?: Record<string, string>
  testFile?: string
  playgroundConfig?: PlaygroundConfig
}

function ProblemPlayground({
  problemId,
  title,
  description,
  sandpackTemplate,
  starterFiles,
  solutionFiles,
  testFile,
  playgroundConfig,
}: Props) {
  const isReact = sandpackTemplate === 'react-ts'

  const instructions = (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="h-full">
      <PlaygroundRoot
        template={sandpackTemplate}
        files={starterFiles}
        playgroundConfig={playgroundConfig}
        activeFile={isReact ? '/App.tsx' : '/index.ts'}
        autorun={false}
      >
        <PlaygroundLayout
          instructions={instructions}
          hasTestFile={!!testFile}
          isReact={isReact}
          template={sandpackTemplate}
          solutionFiles={solutionFiles}
          playgroundConfig={playgroundConfig}
        />
      </PlaygroundRoot>
    </div>
  )
}

export { ProblemPlayground }
