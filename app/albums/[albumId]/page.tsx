import { notFound, redirect } from 'next/navigation'
import { loadDefaultAlbumVersionFromAlbumId } from '@/lib/catalog-api'

interface AlbumPageProps {
  params: Promise<{ albumId: string }>
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { albumId } = await params

  let routeHref: string

  try {
    const defaultVersion = await loadDefaultAlbumVersionFromAlbumId(albumId)

    if (!defaultVersion) {
      notFound()
    }

    routeHref = defaultVersion.routeHref
  } catch {
    notFound()
  }

  redirect(routeHref)
}
