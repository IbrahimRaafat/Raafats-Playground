'use client'

import { SandpackPreview } from '@codesandbox/sandpack-react'

function PreviewPanel() {
  return (
    <SandpackPreview
      showNavigator={false}
      showOpenInCodeSandbox={false}
      style={{ height: '100%', minHeight: 0 }}
    />
  )
}

export { PreviewPanel }
