'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { getAllProgress } from '@/lib/progress/store'

function LessonCompletedBadge({ lessonId }: { lessonId: string }) {
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const progress = getAllProgress()
    setCompleted(progress[lessonId] === 'completed')
  }, [lessonId])

  if (!completed) return null

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full shrink-0">
      <CheckCircle2 className="h-3 w-3" />
      Done
    </span>
  )
}

export { LessonCompletedBadge }
