import Link from 'next/link'
import { Code2, BookOpen, Zap } from 'lucide-react'
import { getAllTracks } from '@/lib/content/loader'

export default function HomePage() {
  const tracks = getAllTracks()
  const totalLessons = tracks.reduce((acc, t) => acc + t.lessons.length, 0)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <span className="font-bold text-lg">TS Playground</span>
        <nav className="flex items-center gap-2">
          <Link
            href="/learn"
            className="text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            Learn
          </Link>
          <Link
            href="/playground"
            className="text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Open Playground
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center space-y-10">
        <div className="space-y-4 max-w-xl">
          <h1 className="text-5xl font-bold tracking-tight">
            Learn TypeScript &amp; React{' '}
            <span className="text-muted-foreground">in the browser</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            A modular playground with live preview, auto-graded lessons, and zero setup.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/learn"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Start Learning
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center px-5 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
            >
              Free Playground
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-left">
          <div className="p-4 rounded-lg border border-border space-y-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Code2 className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold">Live Editor</h3>
            <p className="text-sm text-muted-foreground">
              Write TypeScript and React with instant preview and console output.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border space-y-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold">Structured Lessons</h3>
            <p className="text-sm text-muted-foreground">
              {totalLessons} lessons across {tracks.length} tracks — from fundamentals to React.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border space-y-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold">Auto-graded</h3>
            <p className="text-sm text-muted-foreground">
              Run tests in the browser and get instant pass/fail feedback.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
