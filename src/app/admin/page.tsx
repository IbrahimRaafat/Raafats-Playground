import Link from 'next/link'
import { SiteNavbar } from '@/components/organisms/site-navbar/site-navbar'

export const metadata = { title: 'Admin — TS Playground' }

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <SiteNavbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/lessons"
            className="block p-6 border border-border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <h2 className="text-lg font-semibold mb-2">Lessons</h2>
            <p className="text-sm text-muted-foreground">Manage learning lessons — tracks, content, tests, playground config.</p>
          </Link>

          <Link
            href="/admin/problems"
            className="block p-6 border border-border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <h2 className="text-lg font-semibold mb-2">Problems</h2>
            <p className="text-sm text-muted-foreground">Manage interview problems — questions, companies, playground config.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
