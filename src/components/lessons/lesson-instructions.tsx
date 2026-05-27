import { MDXRemote } from 'next-mdx-remote/rsc'
import type { LessonMeta } from '@/lib/content/types'
import { Badge } from '@/components/ui/badge'

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-500/15 text-green-700 dark:text-green-400',
  intermediate: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
  advanced: 'bg-red-500/15 text-red-700 dark:text-red-400',
}

type Props = {
  meta: LessonMeta
  mdxSource: string
}

export function LessonInstructions({ meta, mdxSource }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-mono">{meta.trackSlug}</span>
          <span className="text-xs text-muted-foreground">/</span>
          <Badge
            variant="secondary"
            className={DIFFICULTY_COLORS[meta.difficulty]}
          >
            {meta.difficulty}
          </Badge>
        </div>
        <h1 className="text-xl font-bold">{meta.title}</h1>
        {meta.description && (
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        )}
      </div>

      <hr className="border-border" />

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <MDXRemote source={mdxSource} />
      </div>
    </div>
  )
}
