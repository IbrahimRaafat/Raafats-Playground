import { PlaygroundRoot } from '@/components/providers/playground-root/playground-root'
import { PlaygroundLayout } from '@/components/organisms/playground-layout/playground-layout'
import { BreadcrumbNav } from '@/components/molecules/breadcrumb-nav/breadcrumb-nav'
import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle'
import { LanguageToggle } from '@/components/atoms/language-toggle/language-toggle'

export const metadata = { title: 'Playground — TS Playground' }

export default function PlaygroundPage() {
  return (
    <div className="h-screen flex flex-col">
      <BreadcrumbNav
        items={[{ labelKey: 'breadcrumb.freePlyd' }]}
        actions={<><ThemeToggle /><LanguageToggle /></>}
      />

      <div className="flex-1 min-h-0">
        <PlaygroundRoot template="vanilla-ts" autorun={false}>
          <PlaygroundLayout showRunButton />
        </PlaygroundRoot>
      </div>
    </div>
  )
}
