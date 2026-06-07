export type RawQuestion = {
  source: string
  source_id: string
  title: string
  description: string
  type: 'coding' | 'theory'
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  companies: string[]
  tags: string[]
  answer?: string
  hint?: string
  starter_code?: string
  is_premium?: boolean
}
