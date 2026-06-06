import type { Meta, StoryObj } from '@storybook/react'
import { ThemeToggle } from './theme-toggle'
import { ThemeProvider } from '@/components/providers/theme-provider/theme-provider'

function Wrapper() {
  return (
    <ThemeProvider>
      <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card">
        <span className="text-sm text-muted-foreground">Toggle theme:</span>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  )
}

const meta: Meta<typeof Wrapper> = {
  title: 'Atoms/ThemeToggle',
  component: Wrapper,
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof Wrapper>
export const Default: Story = {}
