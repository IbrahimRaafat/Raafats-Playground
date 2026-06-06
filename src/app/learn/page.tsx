import { getAllTracks } from '@/lib/content/loader'
import { LearnContent } from './_components/learn-content'

export const metadata = { title: 'Learn — TS Playground' }

export default function LearnPage() {
  const tracks = getAllTracks()
  return <LearnContent tracks={tracks} />
}
