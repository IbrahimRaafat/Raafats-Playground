'use client'

import { SandpackPreview } from '@codesandbox/sandpack-react'

export function PreviewPanel() {
  return (
    <SandpackPreview
      showNavigator={false}
      showOpenInCodeSandbox={false}
      style={{ height: '100%', minHeight: 0 }}
    />
  )
}
