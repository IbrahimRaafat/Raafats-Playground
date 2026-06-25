'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Circle } from 'lucide-react'
import { getAllProgress } from '@/lib/progress/store'
import { useTranslation } from '@/components/providers/locale-provider/locale-provider'
import type { LessonMeta } from '@/lib/content/types'

type Props = {
  trackSlug: string
  lessons: LessonMeta[]
}

function TrackProgress({ trackSlug, lessons }: Props) {
  const [progress, setProgress] = useState<Record<string, string>>({})
  const { t } = useTranslation()

  useEffect(() => {
    getAllProgress().then(setProgress)
  }, [])

  const completedCount = lessons.filter((l) => progress[`${trackSlug}/${l.slug}`] === 'completed').length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t('progress.label')}</span>
        <span className="font-medium">{completedCount} / {lessons.length}</span>
      </div>

      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${(completedCount / lessons.length) * 100}%` }}
        />
      </div>

      <ul className="space-y-1">
        {lessons.map((lesson) => {
          const done = progress[`${trackSlug}/${lesson.slug}`] === 'completed'
          return (
            <li key={lesson.slug}>
              <Link
                href={`/learn/${trackSlug}/${lesson.slug}`}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted transition-colors"
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className={done ? 'text-muted-foreground line-through' : ''}>
                  {lesson.title}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { TrackProgress }
