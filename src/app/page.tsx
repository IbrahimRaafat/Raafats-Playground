import { getAllTracksAsync } from '@/lib/content/loader'
import { HomeContent } from './_components/home-content'

export default async function HomePage() {
  const tracks = await getAllTracksAsync()
  return <HomeContent tracks={tracks} />
}
