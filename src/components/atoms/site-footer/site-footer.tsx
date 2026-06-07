import Link from 'next/link'

const LIME = '#cbf04f'

function SiteFooter() {
  return (
    <footer className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-neutral-100">
          <span style={{ color: LIME }}>TS</span> Playground
        </div>
        <div className="flex items-center gap-4">
          <Link href="/learn" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Learn</Link>
          <Link href="/questions" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Questions</Link>
          <Link href="/playground" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">Playground</Link>
        </div>
        <span>© {new Date().getFullYear()} TS Playground. All rights reserved.</span>
      </div>
    </footer>
  )
}

export { SiteFooter }
