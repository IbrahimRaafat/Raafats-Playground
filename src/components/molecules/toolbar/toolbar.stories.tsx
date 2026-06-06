import type { Meta, StoryObj } from '@storybook/react'
import { SandpackProvider } from '@codesandbox/sandpack-react'
import { Toolbar } from './toolbar'

// Toolbar must live inside SandpackProvider (it calls useSandpack / useSandpackConsole)
function ToolbarInProvider(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <SandpackProvider
      template="vanilla-ts"
      files={{ '/index.ts': 'console.log("hello")' }}
      options={{ autorun: false }}
    >
      <div className="border border-border rounded-lg overflow-hidden w-full max-w-xl">
        <Toolbar {...props} />
      </div>
    </SandpackProvider>
  )
}

const meta: Meta<typeof Toolbar> = {
  title: 'Molecules/Toolbar',
  component: Toolbar,
  parameters: { layout: 'padded' },
  render: (args) => <ToolbarInProvider {...args} />,
}
export default meta

type Story = StoryObj<typeof Toolbar>

export const FreeSandbox: Story = {
  args: { showRunButton: true },
}

export const LessonWithTests: Story = {
  args: {
    testFile: `const result = 1 + 1;\nif (result === 2) { console.log('✅ All tests passed!'); } else { console.log('❌ Expected 2'); }`,
    template: 'vanilla-ts',
  },
}

export const ResetOnly: Story = {
  args: {},
}
