import Link from 'next/link'
import { PlaygroundRoot } from '@/components/playground/playground-root'
import { PlaygroundLayout } from '@/components/playground/playground-layout'

export const metadata = { title: 'Playground — TS Playground' }

export default function PlaygroundPage() {
  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center gap-3 px-4 py-2 border-b border-border bg-background shrink-0">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">
          TS Playground
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-muted-foreground">Free Playground</span>
      </header>

      <div className="flex-1 min-h-0">
        <PlaygroundRoot template="react-ts">
          <PlaygroundLayout />
        </PlaygroundRoot>
      </div>
    </div>
  )
}
