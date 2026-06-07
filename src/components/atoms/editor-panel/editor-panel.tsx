'use client'

import { SandpackCodeEditor } from '@codesandbox/sandpack-react'

function EditorPanel() {
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

export { EditorPanel }
