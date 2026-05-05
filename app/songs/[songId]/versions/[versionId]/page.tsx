import { notFound } from 'next/navigation'
import { SongVersionPage as SongVersionDetailPage } from '@/components/templates/song-version-page'
import { loadSongVersionPageByIds } from '@/lib/catalog-api'

interface SongVersionPageProps {
  params: Promise<{ songId: string; versionId: string }>
}

export default async function SongVersionRoutePage({ params }: SongVersionPageProps) {
  const { songId, versionId } = await params

  try {
    const { artist, song, version } = await loadSongVersionPageByIds(songId, versionId)

    return <SongVersionDetailPage artist={artist} song={song} version={version} />
  } catch {
    notFound()
  }
}
