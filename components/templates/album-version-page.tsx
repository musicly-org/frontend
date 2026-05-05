import Link from 'next/link'
import { SiteHeader } from '@/components/organisms/site-header'
import { EntityHero } from '@/components/organisms/entity-hero'
import { RelationSection } from '@/components/organisms/relation-section'
import { RelationCard } from '@/components/molecules/relation-card'
import { TrackList, TrackRow, formatDuration } from '@/components/molecules/track-list'
import type { Album, AlbumVersion, Artist, Track } from '@/lib/types'

interface AlbumVersionPageProps {
  artist?: Artist
  album: Album
  version: AlbumVersion
  tracks: (Track & { songVersion: NonNullable<Track['songVersion']> })[]
  allVersions: AlbumVersion[]
}

export function AlbumVersionPage({
  artist,
  album,
  version,
  tracks,
  allVersions,
}: AlbumVersionPageProps) {
  const hasMultipleDiscs = tracks.some((track) => track.discNumber > 1)
  let currentDisc = 0

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <EntityHero
          title={version.title}
          subtitle={
            artist ? (
              <Link href={artist.routeHref} className="transition-colors hover:text-foreground">
                {artist.name}
              </Link>
            ) : album.title !== version.title ? (
              album.title
            ) : undefined
          }
          imageUrl={version.imageUrl}
          imageAlt={version.title}
          size="lg"
          metadata={[
            version.releasedAt,
            `${tracks.length} ${tracks.length === 1 ? 'track' : 'tracks'}`,
          ].filter((item): item is string => Boolean(item))}
        >
        </EntityHero>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <RelationSection
              title="Tracklist"
              count={tracks.length}
              emptyMessage="No tracks available for this version"
            >
              {tracks.length > 0 && (
                <TrackList>
                  {tracks.map((track) => {
                    const isFirstOfDisc = track.discNumber !== currentDisc
                    if (isFirstOfDisc) {
                      currentDisc = track.discNumber
                    }

                    return (
                      <TrackRow
                        key={track.id}
                        discNumber={track.discNumber}
                        trackNumber={track.trackNumber}
                        title={track.songVersion.title}
                        duration={formatDuration(track.songVersion.durationSeconds)}
                        showDisc={hasMultipleDiscs}
                        isFirstOfDisc={isFirstOfDisc}
                      />
                    )
                  })}
                </TrackList>
              )}
            </RelationSection>
          </div>

          <div className="space-y-8">
            <RelationSection
              title="All Versions"
              count={allVersions.length}
              emptyMessage="No versions available"
            >
              {allVersions.map((albumVersion) => (
                <RelationCard
                  key={albumVersion.id}
                  href={albumVersion.routeHref}
                  title={albumVersion.title}
                  metadata={albumVersion.releasedAt}
                  imageUrl={albumVersion.imageUrl}
                  imageAlt={albumVersion.title}
                  current={albumVersion.href === version.href}
                  defaultVersion={albumVersion.isDefault}
                />
              ))}
            </RelationSection>
          </div>
        </div>
      </main>
    </div>
  )
}
