'use client'

import { SandpackProvider } from '@codesandbox/sandpack-react'
import { sandpackDark } from '@codesandbox/sandpack-themes'
import type { SandpackTemplate } from '@/lib/content/types'

type Props = {
  template?: SandpackTemplate
  files?: Record<string, string>
  hiddenFiles?: string[]
  children: React.ReactNode
}

export function PlaygroundRoot({ template = 'react-ts', files, hiddenFiles = [], children }: Props) {
  const sandpackFiles = files
    ? Object.fromEntries(
        Object.entries(files).map(([name, code]) => [
          name,
          { code, hidden: hiddenFiles.includes(name) },
        ])
      )
    : undefined

  return (
    <SandpackProvider
      template={template}
      files={sandpackFiles}
      theme={sandpackDark}
      options={{
        recompileMode: 'delayed',
        recompileDelay: 500,
      }}
    >
      {children}
    </SandpackProvider>
  )
}
