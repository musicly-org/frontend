import Link from 'next/link'
import { EntityHero } from '@/components/organisms/entity-hero'
import { RelationSection } from '@/components/organisms/relation-section'
import { RelationCard } from '@/components/molecules/relation-card'
import { formatDuration } from '@/components/molecules/track-list'
import type { Artist, Release, Track } from '@/lib/types'
import { Music, Clock, Disc } from 'lucide-react'

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
                    <Link href={artist.routeHref} className="transition-colors hover:text-foreground">
                      {artist.name}
                    </Link>
                  </span>
                ))}
              </span>
            ) : undefined
          }
          imageUrl={track.imageUrl}
          imageAlt={track.title}
          size="md"
          metadata={[
            formatDuration(track.durationSeconds),
            track.releasedAt,
          ].filter((item): item is string => Boolean(item))}
        >
          {currentRelease && (
            <div className="mt-4">
              <Link 
                href={currentReleasePageHref} 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <Disc className="h-4 w-4" />
                <span className="group-hover:underline">{currentRelease.title}</span>
              </Link>
            </div>
          )}
        </EntityHero>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Track Details */}
          <div className="space-y-8">
            {/* Track Info Card */}
            <div className="rounded-xl border border-border/50 bg-card/50 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Track Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatDuration(track.durationSeconds) || 'Unknown'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Position</p>
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <Music className="h-4 w-4 text-muted-foreground" />
                    Disc {track.discNumber}, Track {track.trackNumber}
                  </p>
                </div>
                {track.releasedAt && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Released</p>
                    <p className="font-medium text-foreground">{track.releasedAt}</p>
                  </div>
                )}
                {artists.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Artist</p>
                    <p className="font-medium text-foreground">
                      {artists.map(a => a.name).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Artist links */}
            {artists.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Artists</h2>
                <div className="space-y-2">
                  {artists.map((artist) => (
                    <Link
                      key={artist.id}
                      href={artist.routeHref}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="h-12 w-12 rounded-full bg-muted overflow-hidden shrink-0">
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <RelationSection
              title="Other Releases"
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
        </div>
      </main>
    </div>
  )
}
