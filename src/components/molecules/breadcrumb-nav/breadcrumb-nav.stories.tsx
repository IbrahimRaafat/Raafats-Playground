import type { Meta, StoryObj } from '@storybook/react'
import { BreadcrumbNav } from './breadcrumb-nav'
import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle'
import { LanguageToggle } from '@/components/atoms/language-toggle/language-toggle'

const meta: Meta<typeof BreadcrumbNav> = {
  title: 'Molecules/BreadcrumbNav',
  component: BreadcrumbNav,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof BreadcrumbNav>

export const Learn: Story = {
  args: {
    items: [{ label: 'Learn', href: '/learn' }],
  },
}

export const Track: Story = {
  args: {
    items: [
      { label: 'Learn', href: '/learn' },
      { label: 'JavaScript / TypeScript', href: '/learn/javascript' },
    ],
  },
}

export const Lesson: Story = {
  args: {
    items: [
      { label: 'Learn', href: '/learn' },
      { label: 'JavaScript / TypeScript', href: '/learn/javascript' },
      { label: 'Variables & Constants' },
    ],
  },
}

export const WithActions: Story = {
  args: {
    items: [
      { label: 'Learn', href: '/learn' },
      { label: 'JavaScript / TypeScript', href: '/learn/javascript' },
      { label: 'Variables & Constants' },
    ],
    actions: (
      <>
        <ThemeToggle />
        <LanguageToggle />
      </>
    ),
  },
}

export const Playground: Story = {
  args: {
    items: [{ label: 'Free Playground' }],
  },
}
