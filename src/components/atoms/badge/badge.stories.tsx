import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'
import { CheckCircle2, XCircle } from 'lucide-react'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive', 'ghost'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = { args: { children: 'Badge' } }
export const Secondary: Story = { args: { children: 'Secondary', variant: 'secondary' } }
export const Outline: Story = { args: { children: 'Outline', variant: 'outline' } }
export const Destructive: Story = { args: { children: 'Error', variant: 'destructive' } }

export const TestStatus: Story = {
  args: { children: undefined },
  render: () => (
    <div className="flex gap-2">
      <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-600">
        <CheckCircle2 className="h-3 w-3" />All tests passed
      </Badge>
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />Tests failed
      </Badge>
    </div>
  ),
}
