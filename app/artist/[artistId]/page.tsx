import { notFound } from 'next/navigation'
import { ArtistPage as ArtistDetailPage } from '@/components/templates/artist-page'
import { loadArtistPageById } from '@/lib/catalog-api'

interface ArtistPageProps {
  params: Promise<{ artistId: string }>
}

export default async function ArtistRoutePage({ params }: ArtistPageProps) {
  const { artistId } = await params

  try {
    const { artist, albums, songs } = await loadArtistPageById(artistId)

    return <ArtistDetailPage artist={artist} albums={albums} songs={songs} />
  } catch {
    notFound()
  }
}
