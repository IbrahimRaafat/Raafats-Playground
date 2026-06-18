'use client'

import { SandpackProvider } from '@codesandbox/sandpack-react'
import type { SandpackProviderProps } from '@codesandbox/sandpack-react'
import { useTheme } from '@/components/providers/theme-provider/theme-provider'
import { sandpackThemes } from '@/lib/sandpack/themes'
import type { SandpackTemplate, PlaygroundConfig, PlaygroundFileConfig } from '@/lib/content/types'

type Props = {
  template?: SandpackTemplate
  files?: Record<string, string>
  hiddenFiles?: string[]
  readOnlyFiles?: string[]
  playgroundConfig?: PlaygroundConfig
  customSetup?: SandpackProviderProps['customSetup']
  activeFile?: string
  autorun?: boolean
  children: React.ReactNode
}

function applyFileConfig(
  files: Record<string, { code: string; hidden: boolean; readOnly: boolean }>,
  fileConfig?: Record<string, PlaygroundFileConfig>
): Record<string, { code: string; hidden: boolean; readOnly: boolean }> {
  if (!fileConfig) return files

  const result: Record<string, { code: string; hidden: boolean; readOnly: boolean }> = {}

  for (const [path, file] of Object.entries(files)) {
    const config = fileConfig[path]
    result[path] = {
      code: file.code,
      hidden: config?.visible === false ? true : file.hidden,
      readOnly: config?.editable === false ? true : file.readOnly,
    }
  }

  return result
}

function PlaygroundRoot({
  template = 'react-ts',
  files,
  hiddenFiles = [],
  readOnlyFiles = [],
  playgroundConfig,
  customSetup,
  activeFile,
  autorun = true,
  children,
}: Props) {
  const { theme } = useTheme()

  const effectiveAutorun = playgroundConfig?.autorun ?? autorun

  let sandpackFiles = files
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

  if (sandpackFiles && playgroundConfig?.files) {
    sandpackFiles = applyFileConfig(sandpackFiles, playgroundConfig.files)
  }

  return (
    <SandpackProvider
      template={template}
      files={sandpackFiles}
      customSetup={customSetup}
      theme={sandpackThemes[theme]}
      options={{
        recompileMode: 'delayed',
        recompileDelay: effectiveAutorun ? 500 : 9_999_999,
        autorun: effectiveAutorun,
        ...(activeFile ? { activeFile } : {}),
      }}
    >
      <div className="h-full flex flex-col">
        {children}
      </div>
    </SandpackProvider>
  )
}

export { PlaygroundRoot }
