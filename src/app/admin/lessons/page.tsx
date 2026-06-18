import { supabase } from '@/lib/supabase/client'
import { AdminLessonsList } from './_components/admin-lessons-list'
import { SiteNavbar } from '@/components/organisms/site-navbar/site-navbar'

export const metadata = { title: 'Admin — Lessons' }

type DbLesson = {
  id: string
  track_slug: string
  slug: string
  title: string
  description: string
  difficulty: string
  sort_order: number
  mdx_content: string
  sandpack_template: string
  starter_files: Record<string, string>
  solution_files: Record<string, string>
  test_file: string
  playground_config: object | null
}

async function getLessons(): Promise<DbLesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('track_slug')
    .order('sort_order')

  if (error) {
    console.error('Failed to fetch lessons:', error.message)
    return []
  }

  return (data as DbLesson[]) ?? []
}

export default async function AdminLessonsPage() {
  const lessons = await getLessons()

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <SiteNavbar />
      <div className="flex-1">
        <AdminLessonsList lessons={lessons} />
      </div>
    </div>
  )
}
