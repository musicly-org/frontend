import Link from 'next/link'
import Image from 'next/image'
import { EntityHero } from '@/components/organisms/entity-hero'
import { RelationSection } from '@/components/organisms/relation-section'
import { RelationCard } from '@/components/molecules/relation-card'
import { formatDuration } from '@/components/molecules/track-list'
import { Clock, Disc3, Music, ExternalLink } from 'lucide-react'
import type { Artist, Release, Track } from '@/lib/types'

interface TrackPageProps {
  artists: Artist[]
  currentReleasePageHref: string
  releases: Release[]
  selectedReleaseId?: string
  track: Track
}

export function TrackPage({ artists, currentReleasePageHref, releases, selectedReleaseId, track }: TrackPageProps) {
  const currentRelease = releases.find((release) => release.id === selectedReleaseId)

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EntityHero
          title={track.title}
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
            ) : (
              'Track'
            )
          }
          imageUrl={track.imageUrl}
          imageAlt={track.title}
          size="md"
          variant="immersive"
          metadata={[
            formatDuration(track.durationSeconds),
            track.releasedAt,
          ].filter((item): item is string => Boolean(item))}
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main content */}
          <div className="space-y-8">
            {/* Track details card */}
            <div className="rounded-2xl bg-surface-elevated ring-1 ring-white/5 p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Track Details</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {track.durationSeconds && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Duration</span>
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      {formatDuration(track.durationSeconds)}
                    </p>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Disc3 className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Position</span>
                  </div>
                  <p className="text-lg font-medium text-foreground">
                    Disc {track.discNumber}, Track {track.trackNumber}
                  </p>
                </div>
                
                {track.releasedAt && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Music className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Released</span>
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      {track.releasedAt}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Current release link */}
            {currentRelease && (
              <Link
                href={currentReleasePageHref}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-surface-elevated ring-1 ring-white/5 hover:ring-accent/30 transition-all"
              >
                {currentRelease.imageUrl ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-1 ring-white/10 shrink-0">
                    <Image
                      src={currentRelease.imageUrl}
                      alt={currentRelease.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-background flex items-center justify-center ring-1 ring-white/10 shrink-0">
                    <span className="text-2xl font-serif text-muted-foreground/30">
                      {currentRelease.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1">
                    From the release
                  </p>
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                    {currentRelease.title}
                  </h3>
                  {currentRelease.releasedAt && (
                    <p className="text-sm text-muted-foreground">{currentRelease.releasedAt}</p>
                  )}
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0" />
              </Link>
            )}

            {/* Artists */}
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

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Album art */}
            {track.imageUrl && (
              <div className="hidden lg:block rounded-2xl overflow-hidden bg-surface-elevated ring-1 ring-white/5">
                <div className="relative aspect-square">
                  <Image
                    src={track.imageUrl}
                    alt={track.title}
                    fill
                    className="object-cover"
                    sizes="340px"
                  />
                </div>
              </div>
            )}

            {/* Other releases */}
            {releases.length > 1 && (
              <div className="rounded-2xl bg-surface-elevated ring-1 ring-white/5 p-6">
                <RelationSection
                  title="Available On"
                  count={releases.length}
                  emptyMessage="No releases available"
                >
                  {releases.map((release) => (
                    <RelationCard
                      key={release.id}
                      href={release.routeHref}
                      title={release.title}
                      metadata={release.releasedAt}
                      imageUrl={release.imageUrl}
                      imageAlt={release.title}
                      current={release.id === selectedReleaseId}
                      defaultVersion={release.isDefault}
                    />
                  ))}
                </RelationSection>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
