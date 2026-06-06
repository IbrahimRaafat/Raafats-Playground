'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import type { Track } from '@/lib/content/types'

type Props = {
  track: Track
  layout?: 'grid' | 'list'
}

function TrackCard({ track, layout = 'list' }: Props) {
  const { t } = useTranslation()
  const lessonsLabel = t('track.lessons', { count: track.lessons.length })

  if (layout === 'grid') {
    return (
      <Link
        href={`/learn/${track.slug}`}
        className="group flex flex-col gap-4 p-6 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-accent/30 transition-all"
      >
        <div className="flex items-start justify-between">
          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold font-mono text-sm">
            {track.icon}
          </span>
          <span className="text-xs text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
            {lessonsLabel}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
            {track.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{track.description}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/learn/${track.slug}`}
      className="group flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-accent/20 transition-all"
    >
      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-bold font-mono text-sm shrink-0">
        {track.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold group-hover:text-primary transition-colors">{track.title}</span>
          <span className="text-xs text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
            {lessonsLabel}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{track.description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 rtl:scale-x-[-1]" />
    </Link>
  )
}

export { TrackCard }
