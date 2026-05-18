import { EntityHero } from '@/components/organisms/entity-hero'
import { RelationSection } from '@/components/organisms/relation-section'
import { RelationCard, ReleaseCard } from '@/components/molecules/relation-card'
import type { Album, Artist, Song } from '@/lib/types'

interface ArtistPageProps {
  artist: Artist
  albums: Album[]
  songs: Song[]
}

export function ArtistPage({ artist, albums, songs }: ArtistPageProps) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EntityHero
          title={artist.name}
          subtitle="Artist"
          imageUrl={artist.imageUrl}
          imageAlt={artist.name}
          size="lg"
          variant="immersive"
          metadata={[
            `${albums.length} ${albums.length === 1 ? 'release' : 'releases'}`,
            `${songs.length} ${songs.length === 1 ? 'track' : 'tracks'}`,
          ]}
        />

        <div className="mt-16 space-y-16">
          {/* Discography as grid */}
          <RelationSection
            title="Discography"
            count={albums.length}
            emptyMessage="No releases available"
            variant="grid"
          >
            {albums.map((album) => (
              <ReleaseCard
                key={album.id}
                href={album.routeHref}
                title={album.title}
                year={album.releasedAt ? parseInt(album.releasedAt) : undefined}
                imageUrl={album.imageUrl}
              />
            ))}
          </RelationSection>

          {/* Tracks list */}
          <RelationSection
            title="Tracks"
            count={songs.length}
            emptyMessage="No tracks available"
          >
            {songs.map((song) => (
              <RelationCard
                key={song.id}
                href={song.detailRouteHref}
                title={song.title}
                metadata={song.releasedAt}
                imageUrl={song.imageUrl}
                imageAlt={song.title}
                badge={song.detailRouteHref ? undefined : 'No tracks'}
              />
            ))}
          </RelationSection>
        </div>
      </main>
    </div>
  )
}
