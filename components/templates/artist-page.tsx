import Link from 'next/link'
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

        <div className="mt-12 space-y-12">
          {/* Popular Tracks section - horizontal scroll on mobile */}
          {songs.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Popular Tracks</h2>
              <div className="grid gap-2">
                {songs.slice(0, 5).map((song, index) => (
                  <Link
                    key={song.id}
                    href={song.detailRouteHref || '#'}
                    className="group flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <span className="w-5 text-center text-sm text-muted-foreground group-hover:hidden">
                      {index + 1}
                    </span>
                    <span className="hidden w-5 text-center group-hover:block">
                      <svg className="h-4 w-4 text-primary fill-primary mx-auto" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </span>
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-muted shrink-0">
                      {song.imageUrl ? (
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground/50">
                          {song.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {song.title}
                      </p>
                    </div>
                    {song.releasedAt && (
                      <span className="text-sm text-muted-foreground shrink-0">
                        {song.releasedAt}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Albums and Songs sections */}
          <div className="grid gap-12 lg:grid-cols-2">
            <RelationSection
              title="Discography"
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
              title="All Songs"
              count={songs.length}
              emptyMessage="No songs available"
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
        </div>
      </main>
    </div>
  )
}
