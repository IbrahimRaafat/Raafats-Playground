import type { Meta, StoryObj } from '@storybook/react'
import { LanguageToggle } from './language-toggle'
import { LocaleProvider } from '@/components/providers/locale-provider/locale-provider'
import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle'
import { ThemeProvider } from '@/components/providers/theme-provider/theme-provider'

function Wrapper() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <div className="flex items-center gap-2 p-4 border border-border rounded-lg bg-card">
          <span className="text-sm text-muted-foreground me-2">Toggles:</span>
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </LocaleProvider>
    </ThemeProvider>
  )
}

const meta: Meta<typeof Wrapper> = {
  title: 'Atoms/LanguageToggle',
  component: Wrapper,
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof Wrapper>
export const Default: Story = {}
