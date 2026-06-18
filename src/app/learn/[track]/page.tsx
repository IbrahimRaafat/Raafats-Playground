import { notFound } from 'next/navigation'
import { getTrackAsync } from '@/lib/content/loader'
import { TrackContent } from './_components/track-content'

type Props = { params: Promise<{ track: string }> }

export async function generateMetadata({ params }: Props) {
  const { track: trackSlug } = await params
  const track = await getTrackAsync(trackSlug)
  return { title: track ? `${track.title} — TS Playground` : 'Not found' }
}

export default async function TrackPage({ params }: Props) {
  const { track: trackSlug } = await params
  const track = await getTrackAsync(trackSlug)
  if (!track) notFound()
  return <TrackContent track={track} />
}
