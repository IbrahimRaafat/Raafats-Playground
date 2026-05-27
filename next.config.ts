import type { NextConfig } from 'next'
import { realpathSync } from 'fs'

// process.cwd() preserves the casing typed by the user (e.g. "desktop\projects"),
// but the SWC compiler uses realpathSync internally (e.g. "Desktop\Projects").
// This mismatch causes webpack to create two instances of the same Next.js modules,
// breaking React context invariants. Normalizing cwd to the real FS path fixes it.
try { process.chdir(realpathSync(process.cwd())) } catch {}

const nextConfig: NextConfig = {
  transpilePackages: [
    '@codesandbox/sandpack-react',
    '@codesandbox/sandpack-themes',
    '@codesandbox/nodebox',
    'react-resizable-panels',
    'next-mdx-remote',
  ],
  turbopack: {
    root: process.cwd(),
  },
  webpack: (config) => {
    // pnpm symlinks on Windows resolve to mixed-case paths, causing webpack to
    // load duplicate module instances and breaking Next.js layout router invariants.
    config.resolve.symlinks = false
    return config
  },
}

export default nextConfig
