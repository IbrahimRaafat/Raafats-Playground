import { getAllTracksAsync } from '@/lib/content/loader'
import { LearnContent } from './_components/learn-content'

export const metadata = { title: 'Learn — TS Playground' }

export default async function LearnPage() {
  const tracks = await getAllTracksAsync()
  return <LearnContent tracks={tracks} />
}
