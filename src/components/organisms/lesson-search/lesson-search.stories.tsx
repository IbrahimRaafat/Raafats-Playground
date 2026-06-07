import type { Meta, StoryObj } from '@storybook/react'
import { LessonSearch } from './lesson-search'

// The search dialog fetches /api/lessons on open — unavailable in Storybook without MSW.
// These stories cover the trigger button and static layout.
const meta: Meta<typeof LessonSearch> = {
  title: 'Organisms/LessonSearch',
  component: LessonSearch,
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof LessonSearch>

export const TriggerButton: Story = {}

// Shows the trigger embedded in a mock nav bar, matching how it appears in BreadcrumbNav
export const InNav: Story = {
  render: () => (
    <header className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg bg-background w-[640px]">
      <span className="text-sm font-bold tracking-tight">
        <span className="text-primary">TS</span> Playground
      </span>
      <span className="text-muted-foreground text-sm">/</span>
      <span className="text-sm text-muted-foreground">Learn</span>
      <span className="text-muted-foreground text-sm">/</span>
      <span className="text-sm font-medium">Variables & Constants</span>
      <div className="ms-auto flex items-center gap-1">
        <LessonSearch />
      </div>
    </header>
  ),
}
