import { redirect } from 'next/navigation'

interface TrackRoutePageProps {
  params: Promise<{ songId: string; trackId: string }>
}

export default async function TrackRoutePage({ params }: TrackRoutePageProps) {
  const { trackId } = await params
  redirect(`/track/${trackId}`)
}
