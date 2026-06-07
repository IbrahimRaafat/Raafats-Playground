import { getAllTracks } from '@/lib/content/loader'
import { HomeContent } from './_components/home-content'

export default function HomePage() {
  const tracks = getAllTracks()
  return <HomeContent tracks={tracks} />
}
