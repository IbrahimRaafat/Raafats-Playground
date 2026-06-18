'use client'

import { X, Copy, Check } from 'lucide-react'
import { SandpackCodeEditor, SandpackProvider } from '@codesandbox/sandpack-react'
import { useTheme } from '@/components/providers/theme-provider/theme-provider'
import { sandpackThemes } from '@/lib/sandpack/themes'
import { useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  files: Record<string, string>
}

function SolutionDrawer({ open, onClose, files }: Props) {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  if (!open) return null

  const fileEntries = Object.entries(files)
  const allCode = fileEntries.map(([name, code]) => `// ${name}\n${code}`).join('\n\n')

  const sandpackFiles = Object.fromEntries(
    fileEntries.map(([name, code]) => [
      name.startsWith('/') ? name : `/${name}`,
      { code, readOnly: true },
    ])
  )

  function handleCopy() {
    navigator.clipboard.writeText(allCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative bg-background border border-border rounded-lg shadow-2xl w-[90vw] max-w-3xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div>
            <h2 className="text-sm font-semibold">Solution</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Study the implementation below</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted/50 transition-colors"
            >
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Code content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <SandpackProvider
            template="vanilla-ts"
            files={sandpackFiles}
            theme={sandpackThemes[theme]}
            options={{ autorun: false }}
          >
            <SandpackCodeEditor
              showLineNumbers
              style={{ height: '100%', minHeight: 0 }}
            />
          </SandpackProvider>
        </div>
      </div>
    </div>
  )
}

export { SolutionDrawer }
