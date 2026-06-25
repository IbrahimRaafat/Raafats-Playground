import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { PlaygroundConfig } from '@/lib/content/types'

// Cookie-aware browser client — use in client components that need auth state
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Plain singleton — works on server and client, no auth session (anon key)
export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
