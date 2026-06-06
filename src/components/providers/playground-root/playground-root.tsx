'use client'

import { SandpackProvider } from '@codesandbox/sandpack-react'
import { useTheme } from '@/components/providers/theme-provider/theme-provider'
import { sandpackThemes } from '@/lib/sandpack/themes'
import type { SandpackTemplate } from '@/lib/content/types'

type Props = {
  template?: SandpackTemplate
  files?: Record<string, string>
  hiddenFiles?: string[]
  autorun?: boolean
  children: React.ReactNode
}

function PlaygroundRoot({ template = 'react-ts', files, hiddenFiles = [], autorun = true, children }: Props) {
  const { theme } = useTheme()

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
      theme={sandpackThemes[theme]}
      options={{
        recompileMode: 'delayed',
        recompileDelay: 500,
        autorun,
      }}
    >
      {children}
    </SandpackProvider>
  )
}

export { PlaygroundRoot }
