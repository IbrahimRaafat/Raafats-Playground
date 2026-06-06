'use client'

import { SandpackConsole } from '@codesandbox/sandpack-react'

function ConsolePanel() {
  return (
    <SandpackConsole
      showHeader
      style={{ height: '100%', minHeight: 0 }}
    />
  )
}

export { ConsolePanel }
