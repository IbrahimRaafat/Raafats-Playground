'use client'

import { SandpackCodeEditor, useSandpack } from '@codesandbox/sandpack-react'

const FILE_LABELS: Record<string, string> = {
  '/solution.ts': 'Code',
  '/App.tsx': 'Code',
  '/index.ts': 'Code',
  '/index.tsx': 'Code',
  '/__tests__.ts': 'Test cases',
  '/__tests__.tsx': 'Test cases',
}

const TEMPLATE_FILES = new Set([
  '/styles.css',
  '/index.html',
  '/package.json',
  '/tsconfig.json',
])

function isTemplateFile(filePath: string): boolean {
  if (TEMPLATE_FILES.has(filePath)) return true
  if (filePath.startsWith('/public/')) return true
  return false
}

type Props = {
  testCodeVisible?: boolean
  actionButtons?: React.ReactNode
}

function EditorPanel({ testCodeVisible = true, actionButtons }: Props) {
  const { sandpack } = useSandpack()
  const { files } = sandpack

  const visibleFiles = Object.keys(files).filter(
    (f) => !files[f].hidden && !isTemplateFile(f) && (!testCodeVisible || true) &&
      (!(!testCodeVisible) || (f !== '/__tests__.ts' && f !== '/__tests__.tsx'))
  )

  const displayFiles = testCodeVisible
    ? visibleFiles
    : visibleFiles.filter((f) => f !== '/__tests__.ts' && f !== '/__tests__.tsx')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'var(--muted)', flexShrink: 0 }}>
        {/* File tabs */}
        <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
          {displayFiles.map((filePath) => {
            const label = FILE_LABELS[filePath] ?? filePath.split('/').pop() ?? filePath
            const isActive = filePath === sandpack.activeFile
            return (
              <button
                key={filePath}
                onClick={() => sandpack.setActiveFile(filePath)}
                style={{
                  padding: '0 12px',
                  height: 36,
                  fontSize: 12,
                  fontWeight: 500,
                  borderBottom: isActive ? '2px solid var(--foreground)' : '2px solid transparent',
                  color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                  background: 'none',
                  border: 'none',
                  borderBottomWidth: 2,
                  borderBottomStyle: 'solid',
                  borderBottomColor: isActive ? 'var(--foreground)' : 'transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Action buttons (Reset, Solution) */}
        {actionButtons}
      </div>

      {/* Editor */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
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
