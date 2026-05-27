import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTrack } from '@/lib/content/loader'
import { TrackProgress } from '@/components/lessons/track-progress'
import { ChevronLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type Props = { params: Promise<{ track: string }> }

export async function generateMetadata({ params }: Props) {
  const { track: trackSlug } = await params
  const track = getTrack(trackSlug)
  return { title: track ? `${track.title} — TS Playground` : 'Not found' }
}

export default async function TrackPage({ params }: Props) {
  const { track: trackSlug } = await params
  const track = getTrack(trackSlug)
  if (!track) notFound()

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-3 px-6 py-3 border-b border-border">
        <Link href="/learn" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" />
          Learn
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">{track.title}</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{track.title}</h1>
          <p className="text-muted-foreground">{track.description}</p>
        </div>

        <TrackProgress trackSlug={track.slug} lessons={track.lessons} />

        <ul className="space-y-2">
          {track.lessons.map((lesson, i) => (
            <li key={lesson.slug}>
              <Link
                href={`/learn/${track.slug}/${lesson.slug}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/30 transition-all"
              >
                <span className="text-xs text-muted-foreground font-mono w-5 shrink-0 text-center">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-medium text-sm">{lesson.title}</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {lesson.difficulty}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
