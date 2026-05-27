import Link from 'next/link'
import { getAllTracks } from '@/lib/content/loader'
import { Badge } from '@/components/ui/badge'
import { ChevronRight } from 'lucide-react'

export const metadata = { title: 'Learn — TS Playground' }

export default function LearnPage() {
  const tracks = getAllTracks()

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 px-6 py-3 border-b border-border">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">
          TS Playground
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-muted-foreground">Learn</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Pick a track</h1>
          <p className="text-muted-foreground">
            Structured lessons with a live editor and auto-graded tests.
          </p>
        </div>

        <ul className="space-y-3">
          {tracks.map((track) => (
            <li key={track.slug}>
              <Link
                href={`/learn/${track.slug}`}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all group"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-md bg-muted font-mono font-bold text-sm shrink-0">
                  {track.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{track.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {track.lessons.length} lessons
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{track.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
