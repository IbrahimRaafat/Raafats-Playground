import { supabase } from '@/lib/supabase/client'
import type { DbQuestion } from '@/lib/supabase/client'
import { AdminProblemsList } from './_components/admin-problems-list'
import { SiteNavbar } from '@/components/organisms/site-navbar/site-navbar'

export const metadata = { title: 'Admin — Problems' }

async function getProblems(): Promise<DbQuestion[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch problems:', error.message)
    return []
  }

  return data ?? []
}

export default async function AdminProblemsPage() {
  const problems = await getProblems()

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <SiteNavbar />
      <div className="flex-1">
        <AdminProblemsList problems={problems} />
      </div>
    </div>
  )
}
