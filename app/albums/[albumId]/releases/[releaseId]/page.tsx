import { notFound } from 'next/navigation'
import { ReleasePage as ReleaseDetailPage } from '@/components/templates/release-page'
import { loadReleasePageByIds } from '@/lib/catalog-api'

interface ReleasePageProps {
  params: Promise<{ albumId: string; releaseId: string }>
}

export default async function ReleaseRoutePage({ params }: ReleasePageProps) {
  const { albumId, releaseId } = await params

  try {
    const page = await loadReleasePageByIds(albumId, releaseId)

    return <ReleaseDetailPage {...page} />
  } catch {
    notFound()
  }
}
