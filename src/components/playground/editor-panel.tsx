'use client'

import { SandpackCodeEditor } from '@codesandbox/sandpack-react'

export function EditorPanel() {
  return (
    <SandpackCodeEditor
      showTabs
      showLineNumbers
      showInlineErrors
      wrapContent
      style={{ height: '100%', minHeight: 0 }}
    />
  )
}
