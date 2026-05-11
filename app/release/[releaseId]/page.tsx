import { notFound } from 'next/navigation'
import { ReleasePage as ReleaseDetailPage } from '@/components/templates/release-page'
import { loadReleasePageById } from '@/lib/catalog-api'

interface ReleasePageProps {
  params: Promise<{ releaseId: string }>
}

export default async function ReleaseRoutePage({ params }: ReleasePageProps) {
  const { releaseId } = await params

  try {
    const page = await loadReleasePageById(releaseId)

    return (
      <ReleaseDetailPage
        artists={page.artists}
        album={page.album}
        release={page.release}
        tracks={page.tracks}
        allReleases={page.allReleases}
      />
    )
  } catch {
    notFound()
  }
}
