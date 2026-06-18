'use client'

import { SandpackCodeEditor, useSandpack } from '@codesandbox/sandpack-react'

const FILE_LABELS: Record<string, string> = {
  '/solution.ts': 'Code',
  '/App.tsx': 'Code',
  '/index.ts': 'Code',
  '/index.tsx': 'Code',
  '/__tests__.ts': 'Test cases',
  '/__tests__.tsx': 'Test cases',
  '/tsconfig.json': 'Config',
  '/package.json': 'Config',
}

function EditorPanel() {
  const { sandpack } = useSandpack()
  const { files } = sandpack

  const visibleFiles = Object.keys(files).filter((f) => !files[f].hidden)

  return (
    <div className="flex flex-col h-full">
      {/* Custom tab bar */}
      <div className="flex items-center border-b border-border bg-muted/20 shrink-0 overflow-x-auto">
        {visibleFiles.map((filePath) => {
          const label = FILE_LABELS[filePath] ?? filePath.split('/').pop() ?? filePath
          const isActive = filePath === sandpack.activeFile
          return (
            <button
              key={filePath}
              onClick={() => sandpack.setActiveFile(filePath)}
              className={`px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <SandpackCodeEditor
          showTabs={false}
          showLineNumbers
          showInlineErrors
          wrapContent
          style={{ height: '100%', minHeight: 0 }}
        />
      </div>
    </div>
  )
}

export { EditorPanel }
