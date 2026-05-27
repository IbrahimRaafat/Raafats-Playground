export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type SandpackTemplate = 'vanilla-ts' | 'react-ts'

export type LessonConfig = {
  id: string
  title: string
  difficulty: Difficulty
  sandpackTemplate: SandpackTemplate
  starterFiles: Record<string, string>
  solutionFiles: Record<string, string>
  testFile: string
}

export type LessonMeta = {
  slug: string
  trackSlug: string
  title: string
  description: string
  difficulty: Difficulty
  order: number
}

export type Track = {
  slug: string
  title: string
  description: string
  icon: string
  lessons: LessonMeta[]
}
