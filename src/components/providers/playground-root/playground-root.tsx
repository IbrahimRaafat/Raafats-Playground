'use client'

import { SandpackProvider } from '@codesandbox/sandpack-react'
import type { SandpackProviderProps } from '@codesandbox/sandpack-react'
import { useTheme } from '@/components/providers/theme-provider/theme-provider'
import { sandpackThemes } from '@/lib/sandpack/themes'
import type { SandpackTemplate } from '@/lib/content/types'

type Props = {
  template?: SandpackTemplate
  files?: Record<string, string>
  hiddenFiles?: string[]
  readOnlyFiles?: string[]
  customSetup?: SandpackProviderProps['customSetup']
  activeFile?: string
  autorun?: boolean
  children: React.ReactNode
}

function PlaygroundRoot({
  template = 'react-ts',
  files,
  hiddenFiles = [],
  readOnlyFiles = [],
  customSetup,
  activeFile,
  autorun = true,
  children,
}: Props) {
  const { theme } = useTheme()

  const sandpackFiles = files
    ? Object.fromEntries(
        Object.entries(files).map(([name, code]) => {
          const path = name.startsWith('/') ? name : `/${name}`
          return [
            path,
            {
              code,
              hidden: hiddenFiles.includes(name) || hiddenFiles.includes(path),
              readOnly: readOnlyFiles.includes(name) || readOnlyFiles.includes(path),
            },
          ]
        })
      )
    : undefined

  return (
    <SandpackProvider
      template={template}
      files={sandpackFiles}
      customSetup={customSetup}
      theme={sandpackThemes[theme]}
      options={{
        recompileMode: 'delayed',
        recompileDelay: 500,
        autorun,
        ...(activeFile ? { activeFile } : {}),
      }}
    >
      {children}
    </SandpackProvider>
  )
}

export { PlaygroundRoot }
