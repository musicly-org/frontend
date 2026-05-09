import { EntityHero } from '@/components/organisms/entity-hero'
import { RelationSection } from '@/components/organisms/relation-section'
import { RelationCard } from '@/components/molecules/relation-card'
import type { Album, Artist, Song } from '@/lib/types'

interface ArtistPageProps {
  artist: Artist
  albums: Album[]
  songs: Song[]
}

export function ArtistPage({ artist, albums, songs }: ArtistPageProps) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <EntityHero
          title={artist.name}
          subtitle="Artist"
          imageUrl={artist.imageUrl}
          imageAlt={artist.name}
          size="lg"
          metadata={[
            `${albums.length} ${albums.length === 1 ? 'album' : 'albums'}`,
            `${songs.length} ${songs.length === 1 ? 'song' : 'songs'}`,
          ]}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <RelationSection
            title="Albums"
            count={albums.length}
            emptyMessage="No albums available"
          >
            {albums.map((album) => (
              <RelationCard
                key={album.id}
                href={album.routeHref}
                title={album.title}
                metadata={album.releasedAt}
                imageUrl={album.imageUrl}
                imageAlt={album.title}
              />
            ))}
          </RelationSection>

          <RelationSection
            title="Songs"
            count={songs.length}
            emptyMessage="No songs available"
          >
            {songs.map((song) => (
              <RelationCard
                key={song.id}
                href={song.routeHref}
                title={song.title}
                metadata={song.releasedAt}
                imageUrl={song.imageUrl}
                imageAlt={song.title}
              />
            ))}
          </RelationSection>
        </div>
      </main>
    </div>
  )
}
