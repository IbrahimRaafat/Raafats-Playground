import { MDXRemote } from 'next-mdx-remote/rsc'
import type { LessonMeta } from '@/lib/content/types'
import { DifficultyBadge } from '@/components/atoms/difficulty-badge/difficulty-badge'

type Props = {
  meta: LessonMeta
  mdxSource: string
}

function LessonInstructions({ meta, mdxSource }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-mono">{meta.trackSlug}</span>
          <span className="text-xs text-muted-foreground">/</span>
          <DifficultyBadge difficulty={meta.difficulty} />
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

export { LessonInstructions }
