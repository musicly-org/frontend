import { ArtistsPage as ArtistsIndexPage } from '@/components/templates/artists-page'
import { loadArtistsIndex } from '@/lib/catalog-api'

export default async function HomePage() {
  const artists = await loadArtistsIndex()

  return <ArtistsIndexPage artists={artists} />
}
