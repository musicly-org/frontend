import Link from 'next/link'
import Image from 'next/image'
import { EntityHero } from '@/components/organisms/entity-hero'
import { RelationSection } from '@/components/organisms/relation-section'
import { RelationCard } from '@/components/molecules/relation-card'
import { ReleaseTrackDialog } from '@/components/organisms/release-track-dialog'
import { Clock, Music } from 'lucide-react'
import type { Album, Release, Artist, Track } from '@/lib/types'

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
  const totalDuration = tracks.reduce((sum, track) => sum + (track.durationSeconds || 0), 0)
  const totalMinutes = Math.floor(totalDuration / 60)

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
                    <Link href={artist.routeHref} className="transition-colors hover:text-accent">
                      {artist.name}
                    </Link>
                  </span>
                ))}
              </span>
            ) : album.title !== release.title ? (
              album.title
            ) : (
              'Album'
            )
          }
          imageUrl={release.imageUrl}
          imageAlt={release.title}
          size="lg"
          variant="immersive"
          metadata={[
            release.releasedAt,
            `${tracks.length} ${tracks.length === 1 ? 'track' : 'tracks'}`,
            totalMinutes > 0 ? `${totalMinutes} min` : undefined,
          ].filter((item): item is string => Boolean(item))}
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main content - Tracklist */}
          <div className="space-y-8">
            <div className="rounded-2xl bg-surface-elevated ring-1 ring-white/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Tracklist</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Music className="w-4 h-4" />
                    {tracks.length} tracks
                  </span>
                  {totalMinutes > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {totalMinutes} min
                    </span>
                  )}
                </div>
              </div>
              
              {tracks.length > 0 ? (
                <ReleaseTrackDialog
                  tracks={tracks}
                  hasMultipleDiscs={hasMultipleDiscs}
                />
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No tracks available for this release</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Other releases */}
          <div className="space-y-8">
            {/* Album art showcase */}
            {release.imageUrl && (
              <div className="hidden lg:block rounded-2xl overflow-hidden bg-surface-elevated ring-1 ring-white/5">
                <div className="relative aspect-square">
                  <Image
                    src={release.imageUrl}
                    alt={release.title}
                    fill
                    className="object-cover"
                    sizes="340px"
                  />
                </div>
              </div>
            )}

            {/* Other releases */}
            {allReleases.length > 1 && (
              <div className="rounded-2xl bg-surface-elevated ring-1 ring-white/5 p-6">
                <RelationSection
                  title="Other Versions"
                  count={allReleases.length}
                  emptyMessage="No other versions available"
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
            )}

            {/* Artist links */}
            {artists.length > 0 && (
              <div className="rounded-2xl bg-surface-elevated ring-1 ring-white/5 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {artists.length === 1 ? 'Artist' : 'Artists'}
                </h3>
                <div className="space-y-3">
                  {artists.map((artist) => (
                    <Link
                      key={artist.id}
                      href={artist.routeHref}
                      className="group flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-card-hover transition-colors"
                    >
                      {artist.imageUrl ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-white/10">
                          <Image
                            src={artist.imageUrl}
                            alt={artist.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center ring-1 ring-white/10">
                          <span className="text-lg font-serif text-muted-foreground/40">
                            {artist.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                          {artist.name}
                        </p>
                        <p className="text-xs text-muted-foreground">View profile</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
