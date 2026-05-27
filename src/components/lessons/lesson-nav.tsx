import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { LessonMeta } from '@/lib/content/types'

type Props = {
  track: string
  prev: LessonMeta | null
  next: LessonMeta | null
}

const navLink = 'inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors'

export function LessonNav({ track, prev, next }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-background shrink-0">
      {prev ? (
        <Link href={`/learn/${track}/${prev.slug}`} className={navLink}>
          <ChevronLeft className="h-4 w-4" />
          {prev.title}
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link href={`/learn/${track}/${next.slug}`} className={navLink}>
          {next.title}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <Link href={`/learn/${track}`} className={navLink}>
          Back to track
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
