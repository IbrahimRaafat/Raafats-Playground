'use client'

import { useTranslation } from '@/components/providers/locale-provider/locale-provider'

type Difficulty = 'beginner' | 'intermediate' | 'advanced'

const colors: Record<Difficulty, string> = {
  beginner: 'text-emerald-500 bg-emerald-500/10',
  intermediate: 'text-amber-500 bg-amber-500/10',
  advanced: 'text-red-500 bg-red-500/10',
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { t } = useTranslation()
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${colors[difficulty]}`}>
      {t(`difficulty.${difficulty}`)}
    </span>
  )
}

export { DifficultyBadge, type Difficulty }
