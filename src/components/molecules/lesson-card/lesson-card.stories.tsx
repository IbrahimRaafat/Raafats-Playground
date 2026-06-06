import type { Meta, StoryObj } from '@storybook/react'
import { LessonCard } from './lesson-card'
import type { LessonMeta } from '@/lib/content/types'

const makeMeta = (overrides: Partial<LessonMeta> = {}): LessonMeta => ({
  slug: '01-variables',
  trackSlug: 'javascript',
  title: 'Variables & Constants',
  description: 'Learn about var, let, and const in TypeScript.',
  difficulty: 'beginner',
  order: 1,
  ...overrides,
})

const meta: Meta<typeof LessonCard> = {
  title: 'Molecules/LessonCard',
  component: LessonCard,
  parameters: { layout: 'padded' },
  argTypes: {
    completed: { control: 'boolean' },
  },
}
export default meta

type Story = StoryObj<typeof LessonCard>

export const Beginner: Story = {
  args: { lesson: makeMeta(), index: 1, trackSlug: 'javascript' },
}
export const Intermediate: Story = {
  args: { lesson: makeMeta({ difficulty: 'intermediate', title: 'Functions & Types', order: 2 }), index: 2, trackSlug: 'javascript' },
}
export const Advanced: Story = {
  args: { lesson: makeMeta({ difficulty: 'advanced', title: 'Generics & Utility Types', order: 3 }), index: 3, trackSlug: 'javascript' },
}
export const Completed: Story = {
  args: { lesson: makeMeta(), index: 1, trackSlug: 'javascript', completed: true },
}

export const List: Story = {
  args: {} as never,
  render: () => (
    <div className="space-y-2 w-full max-w-xl">
      <LessonCard lesson={makeMeta({ title: 'Variables & Constants' })} index={1} trackSlug="javascript" completed />
      <LessonCard lesson={makeMeta({ slug: '02-functions', title: 'Functions & Typed Parameters', order: 2 })} index={2} trackSlug="javascript" completed />
      <LessonCard lesson={makeMeta({ slug: '03-types', title: 'Interfaces & Type Annotations', difficulty: 'intermediate', order: 3 })} index={3} trackSlug="javascript" />
      <LessonCard lesson={makeMeta({ slug: '04-generics', title: 'Generics & Utility Types', difficulty: 'advanced', order: 4 })} index={4} trackSlug="javascript" />
    </div>
  ),
}
