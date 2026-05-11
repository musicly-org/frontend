import Link from 'next/link'
import { EntityHero } from '@/components/organisms/entity-hero'
import { RelationSection } from '@/components/organisms/relation-section'
import { RelationCard } from '@/components/molecules/relation-card'
import { formatDuration } from '@/components/molecules/track-list'
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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <EntityHero
          title={track.title}
          subtitle={
            artists.length > 0 ? (
              <span>
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
            `Disc ${track.discNumber} · Track ${track.trackNumber}`,
          ].filter((item): item is string => Boolean(item))}
        >
          {currentRelease && (
            <div className="mt-4 text-sm uppercase tracking-wider text-muted-foreground">
              <Link href={currentReleasePageHref} className="transition-colors hover:text-foreground">
                {currentRelease.title}
              </Link>
            </div>
          )}
        </EntityHero>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div />
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
