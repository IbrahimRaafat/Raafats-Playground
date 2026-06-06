import type { Meta, StoryObj } from '@storybook/react'
import { TrackCard } from './track-card'
import type { Track } from '@/lib/content/types'

const jsTrack: Track = {
  slug: 'javascript',
  title: 'JavaScript / TypeScript',
  description: 'Core language features: variables, functions, and types.',
  icon: 'JS',
  lessons: [
    { slug: '01-variables', trackSlug: 'javascript', title: 'Variables', description: '', difficulty: 'beginner', order: 1 },
    { slug: '02-functions', trackSlug: 'javascript', title: 'Functions', description: '', difficulty: 'beginner', order: 2 },
    { slug: '03-types', trackSlug: 'javascript', title: 'Types', description: '', difficulty: 'intermediate', order: 3 },
  ],
}

const reactTrack: Track = {
  slug: 'react',
  title: 'React',
  description: 'Build UIs with components, props, state, and hooks.',
  icon: 'RE',
  lessons: [
    { slug: '01-jsx', trackSlug: 'react', title: 'JSX Basics', description: '', difficulty: 'beginner', order: 1 },
    { slug: '02-components', trackSlug: 'react', title: 'Components', description: '', difficulty: 'beginner', order: 2 },
  ],
}

const meta: Meta<typeof TrackCard> = {
  title: 'Molecules/TrackCard',
  component: TrackCard,
  parameters: { layout: 'padded' },
  argTypes: {
    layout: { control: 'select', options: ['list', 'grid'] },
  },
}
export default meta

type Story = StoryObj<typeof TrackCard>

export const List: Story = {
  args: { track: jsTrack, layout: 'list' },
}

export const Grid: Story = {
  args: { track: jsTrack, layout: 'grid' },
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div className="w-64"><Story /></div>],
}

export const GridRow: Story = {
  args: {} as never,
  render: () => (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <TrackCard track={jsTrack} layout="grid" />
      <TrackCard track={reactTrack} layout="grid" />
    </div>
  ),
}

export const ListAll: Story = {
  args: {} as never,
  render: () => (
    <div className="space-y-3 max-w-xl">
      <TrackCard track={jsTrack} layout="list" />
      <TrackCard track={reactTrack} layout="list" />
    </div>
  ),
}
