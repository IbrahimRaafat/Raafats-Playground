import { createClient } from '@supabase/supabase-js'
import type { PlaygroundConfig } from '@/lib/content/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type DbQuestion = {
  id: string
  source: string
  source_id: string | null
  title: string
  description: string
  type: 'coding' | 'theory'
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string | null
  companies: string[]
  tags: string[]
  answer: string | null
  hint: string | null
  starter_code: string | null
  is_premium: boolean
  playground_config: PlaygroundConfig | null
  created_at: string
  updated_at: string
}
