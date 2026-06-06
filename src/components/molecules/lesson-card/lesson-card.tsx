import Link from 'next/link'
import { ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import { DifficultyBadge } from '@/components/atoms/difficulty-badge/difficulty-badge'
import type { LessonMeta } from '@/lib/content/types'

type Props = {
  lesson: LessonMeta
  index: number
  trackSlug: string
  completed?: boolean
}

function LessonCard({ lesson, index, trackSlug, completed }: Props) {
  return (
    <Link
      href={`/learn/${trackSlug}/${lesson.slug}`}
      className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-accent/20 transition-all"
    >
      <span className="text-xs text-muted-foreground font-mono w-6 shrink-0 text-center">
        {String(index).padStart(2, '0')}
      </span>
      {completed
        ? <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
        : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />}
      <span className="flex-1 font-medium text-sm group-hover:text-primary transition-colors">
        {lesson.title}
      </span>
      <DifficultyBadge difficulty={lesson.difficulty} />
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 rtl:scale-x-[-1]" />
    </Link>
  )
}

export { LessonCard }
