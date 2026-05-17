import Link from 'next/link'
import { EntityHero } from '@/components/organisms/entity-hero'
import { RelationSection } from '@/components/organisms/relation-section'
import { RelationCard } from '@/components/molecules/relation-card'
import { ReleaseTrackDialog } from '@/components/organisms/release-track-dialog'
import type { Album, Release, Artist, Track } from '@/lib/types'
import { Clock, Music2 } from 'lucide-react'

interface ReleasePageProps {
  artists: Artist[]
  album: Album
  release: Release
  tracks: Track[]
  allReleases: Release[]
}

export function ReleasePage({
  artists,
  album,
  release,
  tracks,
  allReleases,
}: ReleasePageProps) {
  const hasMultipleDiscs = tracks.some((track) => track.discNumber > 1)
  const totalDuration = tracks.reduce((acc, track) => acc + (track.durationSeconds || 0), 0)
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600)
    const minutes = Math.floor((totalDuration % 3600) / 60)
    if (hours > 0) return `${hours} hr ${minutes} min`
    return `${minutes} min`
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EntityHero
          title={release.title}
          subtitle={
            artists.length > 0 ? (
              <span className="flex items-center gap-2">
                {artists.map((artist, index) => (
                  <span key={artist.id}>
                    {index > 0 ? ', ' : null}
                    <Link href={artist.routeHref} className="transition-colors hover:text-foreground">
                      {artist.name}
                    </Link>
                  </span>
                ))}
              </span>
            ) : album.title !== release.title ? (
              album.title
            ) : undefined
          }
          imageUrl={release.imageUrl}
          imageAlt={release.title}
          size="lg"
          metadata={[
            release.releasedAt,
            `${tracks.length} ${tracks.length === 1 ? 'track' : 'tracks'}`,
            totalDuration > 0 ? formatTotalDuration() : null,
          ].filter((item): item is string => Boolean(item))}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Tracklist */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Music2 className="h-5 w-5 text-muted-foreground" />
                Tracklist
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatTotalDuration()}
              </div>
            </div>
            
            {tracks.length > 0 ? (
              <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
                <ReleaseTrackDialog
                  tracks={tracks}
                  hasMultipleDiscs={hasMultipleDiscs}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center py-16 px-6 bg-secondary/30 rounded-xl border border-border/50">
                <p className="text-sm text-muted-foreground">
                  No tracks available for this release
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Artists */}
            {artists.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Artists</h2>
                <div className="space-y-2">
                  {artists.map((artist) => (
                    <Link
                      key={artist.id}
                      href={artist.routeHref}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="h-12 w-12 rounded-full bg-muted overflow-hidden shrink-0 ring-1 ring-border/10">
                        {artist.imageUrl ? (
                          <img
                            src={artist.imageUrl}
                            alt={artist.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            {artist.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {artist.name}
                        </p>
                        <p className="text-sm text-muted-foreground">Artist</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Other Releases */}
            <RelationSection
              title="Other Releases"
              count={allReleases.length}
              emptyMessage="No releases available"
            >
              {allReleases.map((item) => (
                <RelationCard
                  key={item.id}
                  href={item.routeHref}
                  title={item.title}
                  metadata={item.releasedAt}
                  imageUrl={item.imageUrl}
                  imageAlt={item.title}
                  current={item.href === release.href}
                  defaultVersion={item.isDefault}
                />
              ))}
            </RelationSection>
          </div>
        </div>
      </main>
    </div>
  )
}
