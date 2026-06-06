import { sandpackDark, githubLight } from '@codesandbox/sandpack-themes'

export const sandpackThemes = {
  dark: sandpackDark,
  light: githubLight,
} as const

export type SandpackColorMode = keyof typeof sandpackThemes
