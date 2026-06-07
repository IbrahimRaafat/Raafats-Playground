import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { Play, RotateCcw, ArrowRight } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xs', 'icon', 'icon-sm', 'icon-lg'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = { args: { children: 'Button' } }
export const Outline: Story = { args: { children: 'Button', variant: 'outline' } }
export const Secondary: Story = { args: { children: 'Button', variant: 'secondary' } }
export const Ghost: Story = { args: { children: 'Button', variant: 'ghost' } }
export const Destructive: Story = { args: { children: 'Delete', variant: 'destructive' } }
export const Small: Story = { args: { children: 'Button', size: 'sm' } }
export const Disabled: Story = { args: { children: 'Disabled', disabled: true } }

export const WithIcon: Story = {
  args: { children: undefined },
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button size="sm" className="gap-1.5"><Play className="h-3.5 w-3.5" />Run Tests</Button>
      <Button variant="ghost" size="sm" className="gap-1.5"><RotateCcw className="h-3.5 w-3.5" />Reset</Button>
      <Button className="gap-2">Start Learning <ArrowRight className="h-4 w-4" /></Button>
      <Button variant="outline">Open Playground</Button>
    </div>
  ),
}

export const AllVariants: Story = {
  args: { children: undefined },
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="p-8 space-y-4 bg-background min-h-screen">
      <h2 className="text-lg font-semibold">All Variants</h2>
      <div className="flex flex-wrap gap-3">
        {(['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const).map((v) => (
          <Button key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
        ))}
      </div>
      <h2 className="text-lg font-semibold pt-4">All Sizes</h2>
      <div className="flex flex-wrap items-center gap-3">
        {(['xs', 'sm', 'default', 'lg'] as const).map((s) => (
          <Button key={s} size={s}>{s}</Button>
        ))}
      </div>
    </div>
  ),
}
