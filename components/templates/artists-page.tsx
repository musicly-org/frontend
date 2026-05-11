import { ArtistCard } from '@/components/molecules/relation-card'
import type { Artist } from '@/lib/types'

export interface ArtistsPageArtist extends Artist {
  albumCount: number
}

interface ArtistsPageProps {
  artists: ArtistsPageArtist[]
}

export function ArtistsPage({ artists }: ArtistsPageProps) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Artists
          </h1>
          <p className="text-muted-foreground">
            Browse the complete catalog of artists and their discographies
          </p>
        </section>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              href={artist.routeHref}
              name={artist.name}
              imageUrl={artist.imageUrl}
              albumCount={artist.albumCount}
            />
          ))}
        </section>
      </main>
    </div>
  )
}
