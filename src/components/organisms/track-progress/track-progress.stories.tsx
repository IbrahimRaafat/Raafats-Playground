import type { Meta, StoryObj } from '@storybook/react'
import { TrackProgress } from './track-progress'
import type { LessonMeta } from '@/lib/content/types'

const lessons: LessonMeta[] = [
  { slug: '01-variables', trackSlug: 'javascript', title: 'Variables & Constants', description: '', difficulty: 'beginner', order: 1 },
  { slug: '02-functions', trackSlug: 'javascript', title: 'Functions & Typed Parameters', description: '', difficulty: 'beginner', order: 2 },
  { slug: '03-types', trackSlug: 'javascript', title: 'Interfaces & Type Annotations', description: '', difficulty: 'intermediate', order: 3 },
  { slug: '04-interfaces', trackSlug: 'javascript', title: 'Interfaces & Object Types', description: '', difficulty: 'beginner', order: 4 },
  { slug: '05-arrays', trackSlug: 'javascript', title: 'Arrays & Tuples', description: '', difficulty: 'intermediate', order: 5 },
]

function seedProgress(completedSlugs: string[]) {
  completedSlugs.forEach((slug) => {
    localStorage.setItem(`javascript/${slug}`, 'completed')
  })
}

function clearProgress() {
  lessons.forEach((l) => localStorage.removeItem(`javascript/${l.slug}`))
}

const meta: Meta<typeof TrackProgress> = {
  title: 'Organisms/TrackProgress',
  component: TrackProgress,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="w-72 border border-border rounded-xl p-4">
        <Story />
      </div>
    ),
  ],
  args: { trackSlug: 'javascript', lessons },
}
export default meta

type Story = StoryObj<typeof TrackProgress>

export const NoProgress: Story = {
  beforeEach: () => { clearProgress() },
}

export const SomeProgress: Story = {
  beforeEach: () => {
    clearProgress()
    seedProgress(['01-variables', '02-functions', '03-types'])
  },
}

export const AllComplete: Story = {
  beforeEach: () => {
    clearProgress()
    seedProgress(lessons.map((l) => l.slug))
  },
}
