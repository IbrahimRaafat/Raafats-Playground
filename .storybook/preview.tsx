import type { Preview } from '@storybook/react'
import { Inter } from 'next/font/google'
import '../src/app/globals.css'

const inter = Inter({ variable: '--font-sans', subsets: ['latin'] })

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'dark',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'dark'
      return (
        <div
          className={`${inter.variable} font-sans ${theme === 'dark' ? 'dark' : ''} bg-background text-foreground min-h-screen`}
          style={{ padding: context.parameters.layout === 'centered' ? '2rem' : 0 }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview
