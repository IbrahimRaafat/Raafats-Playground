import type { StorybookConfig } from '@storybook/nextjs'
import { realpathSync } from 'fs'

const realCwd = (() => {
  try { return (realpathSync as any).native(process.cwd()) } catch {}
  try { return realpathSync(process.cwd()) } catch {}
  return process.cwd()
})()
try { process.chdir(realCwd) } catch {}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: (config) => {
    config.resolve = config.resolve ?? {}
    config.resolve.symlinks = false
    // pnpm on Windows has casing mismatches in virtual store paths — disable the plugin
    config.plugins = (config.plugins ?? []).filter(
      (p) => p?.constructor?.name !== 'CaseSensitivePathsPlugin'
    )
    return config
  },
}

export default config
