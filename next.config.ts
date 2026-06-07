import type { NextConfig } from 'next'
import { realpathSync } from 'fs'

// Normalize cwd to the NTFS-canonical casing (e.g. "Desktop\Projects" not "desktop\projects").
// pnpm must be installed from this same canonical path so its virtual store paths match
// what webpack's SWC compiler resolves via native Windows APIs.
const realCwd = (() => {
  try { return (realpathSync as any).native(process.cwd()) } catch {}
  try { return realpathSync(process.cwd()) } catch {}
  return process.cwd()
})()
try { process.chdir(realCwd) } catch {}

const nextConfig: NextConfig = {
  transpilePackages: [
    '@codesandbox/sandpack-react',
    '@codesandbox/sandpack-themes',
    '@codesandbox/nodebox',
    'react-resizable-panels',
    'next-mdx-remote',
  ],
  turbopack: {
    root: realCwd,
  },
  webpack: (config) => {
    config.resolve.symlinks = false
    return config
  },
}

export default nextConfig
