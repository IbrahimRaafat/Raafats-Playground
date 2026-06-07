import type { Metadata } from 'next'
import { SiteNavbar } from '@/components/organisms/site-navbar/site-navbar'
import { SiteFooter } from '@/components/atoms/site-footer/site-footer'
import { QuestionsContent } from './_components/questions-content'
import { supabase } from '@/lib/supabase/client'
import type { DbQuestion } from '@/lib/supabase/client'

export const metadata: Metadata = {
  title: 'Interview Questions — TS Playground',
  description: 'Coding challenges and theoretical questions from top tech companies like Google, Meta, Amazon, and Microsoft.',
}

export const revalidate = 3600 // re-fetch at most once per hour

async function getQuestions(): Promise<DbQuestion[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('is_premium', false)
    .order('difficulty', { ascending: true })
    .order('title', { ascending: true })

  if (error) {
    console.error('Failed to fetch questions from Supabase:', error.message)
    return []
  }

  return data ?? []
}

export default async function QuestionsPage() {
  const questions = await getQuestions()

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <SiteNavbar />
      <div className="flex-1">
        <QuestionsContent questions={questions} />
      </div>
      <SiteFooter />
    </div>
  )
}
