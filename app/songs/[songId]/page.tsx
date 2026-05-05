import { notFound } from 'next/navigation'
import { SongPage as SongDetailPage } from '@/components/templates/song-page'
import { loadSongPageById } from '@/lib/catalog-api'

interface SongPageProps {
  params: Promise<{ songId: string }>
}

export default async function SongRoutePage({ params }: SongPageProps) {
  const { songId } = await params

  try {
    const { artist, song, versions } = await loadSongPageById(songId)

    return <SongDetailPage artist={artist} song={song} versions={versions} />
  } catch {
    notFound()
  }
}
