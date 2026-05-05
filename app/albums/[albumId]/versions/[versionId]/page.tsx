import { notFound } from 'next/navigation'
import { AlbumVersionPage as AlbumVersionDetailPage } from '@/components/templates/album-version-page'
import { loadAlbumVersionPageByIds } from '@/lib/catalog-api'

interface AlbumVersionPageProps {
  params: Promise<{ albumId: string; versionId: string }>
}

export default async function AlbumVersionRoutePage({ params }: AlbumVersionPageProps) {
  const { albumId, versionId } = await params

  try {
    const page = await loadAlbumVersionPageByIds(albumId, versionId)

    return <AlbumVersionDetailPage {...page} />
  } catch {
    notFound()
  }
}
