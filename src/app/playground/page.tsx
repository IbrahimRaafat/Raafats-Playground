import { PlaygroundRoot } from '@/components/providers/playground-root/playground-root'
import { PlaygroundLayout } from '@/components/organisms/playground-layout/playground-layout'
import { SiteNavbar } from '@/components/organisms/site-navbar/site-navbar'
import { SiteFooter } from '@/components/atoms/site-footer/site-footer'

export const metadata = { title: 'Playground — TS Playground' }

export default function PlaygroundPage() {
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-neutral-950">
      <SiteNavbar />

      <div className="flex-1 min-h-0">
        <PlaygroundRoot template="vanilla-ts" autorun={false}>
          <PlaygroundLayout showRunButton />
        </PlaygroundRoot>
      </div>

      <SiteFooter />
    </div>
  )
}
