import { notFound, redirect } from 'next/navigation'
import { loadDefaultReleaseFromAlbumId } from '@/lib/catalog-api'

interface AlbumPageProps {
  params: Promise<{ albumId: string }>
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { albumId } = await params

  let routeHref: string

  try {
    const defaultRelease = await loadDefaultReleaseFromAlbumId(albumId)

    if (!defaultRelease) {
      notFound()
    }

    routeHref = defaultRelease.routeHref
  } catch {
    notFound()
  }

  redirect(routeHref)
}
