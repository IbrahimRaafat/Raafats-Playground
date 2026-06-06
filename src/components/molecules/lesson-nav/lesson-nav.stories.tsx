import type { Meta, StoryObj } from '@storybook/react'
import { LessonNav } from './lesson-nav'
import type { LessonMeta } from '@/lib/content/types'

const l = (slug: string, title: string, order: number): LessonMeta => ({
  slug,
  trackSlug: 'javascript',
  title,
  description: '',
  difficulty: 'beginner',
  order,
})

const meta: Meta<typeof LessonNav> = {
  title: 'Molecules/LessonNav',
  component: LessonNav,
  parameters: { layout: 'fullscreen' },
  args: { track: 'javascript' },
}
export default meta

type Story = StoryObj<typeof LessonNav>

export const FirstLesson: Story = {
  args: {
    prev: null,
    next: l('02-functions', 'Functions & Typed Parameters', 2),
  },
}

export const MiddleLesson: Story = {
  args: {
    prev: l('01-variables', 'Variables & Constants', 1),
    next: l('03-types', 'Interfaces & Type Annotations', 3),
  },
}

export const LastLesson: Story = {
  args: {
    prev: l('07-generics', 'Generics', 7),
    next: null,
  },
}
