import { notFound } from 'next/navigation'
import { TrackPage as TrackDetailPage } from '@/components/templates/track-page'
import { loadTrackPageById } from '@/lib/catalog-api'

interface TrackPageProps {
  params: Promise<{ trackId: string }>
}

export default async function TrackRoutePage({ params }: TrackPageProps) {
  const { trackId } = await params

  try {
    const { artists, currentReleasePageHref, releases, selectedReleaseId, track } = await loadTrackPageById(trackId)

    return (
      <TrackDetailPage
        artists={artists}
        currentReleasePageHref={currentReleasePageHref}
        releases={releases}
        selectedReleaseId={selectedReleaseId}
        track={track}
      />
    )
  } catch {
    notFound()
  }
}
