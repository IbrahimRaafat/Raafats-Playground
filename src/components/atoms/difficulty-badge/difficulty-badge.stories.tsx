import type { Meta, StoryObj } from '@storybook/react'
import { DifficultyBadge } from './difficulty-badge'

const meta: Meta<typeof DifficultyBadge> = {
  title: 'Atoms/DifficultyBadge',
  component: DifficultyBadge,
  parameters: { layout: 'centered' },
  argTypes: {
    difficulty: { control: 'select', options: ['beginner', 'intermediate', 'advanced'] },
  },
}
export default meta

type Story = StoryObj<typeof DifficultyBadge>

export const Beginner: Story = { args: { difficulty: 'beginner' } }
export const Intermediate: Story = { args: { difficulty: 'intermediate' } }
export const Advanced: Story = { args: { difficulty: 'advanced' } }

export const All: Story = {
  args: { difficulty: 'beginner' },
  render: () => (
    <div className="flex gap-2">
      <DifficultyBadge difficulty="beginner" />
      <DifficultyBadge difficulty="intermediate" />
      <DifficultyBadge difficulty="advanced" />
    </div>
  ),
}
