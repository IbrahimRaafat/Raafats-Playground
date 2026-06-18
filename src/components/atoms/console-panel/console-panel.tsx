'use client'

import { SandpackConsole } from '@codesandbox/sandpack-react'

function ConsolePanel() {
  return (
    <div className="h-full overflow-auto">
      <SandpackConsole
        showHeader
        style={{ height: '100%', minHeight: 0 }}
      />
    </div>
  )
}

export { ConsolePanel }
