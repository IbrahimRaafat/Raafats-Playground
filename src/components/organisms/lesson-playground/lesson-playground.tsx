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

function LessonPlayground({ lessonId, template, files, hiddenFiles, testFile, instructions }: Props) {
  const handleTestResult = useCallback(
    (passed: boolean) => {
      if (passed) markComplete(lessonId)
    },
    [lessonId]
  )

  return (
    <PlaygroundRoot template={template} files={files} hiddenFiles={hiddenFiles}>
      <PlaygroundLayout
        instructions={instructions}
        testFile={testFile}
        template={template}
        onTestResult={handleTestResult}
      />
    </PlaygroundRoot>
  )
}

export { LessonPlayground }
