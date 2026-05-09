import Link from 'next/link'
import { EntityHero } from '@/components/organisms/entity-hero'
import { RelationSection } from '@/components/organisms/relation-section'
import { RelationCard } from '@/components/molecules/relation-card'
import { ReleaseTrackDialog } from '@/components/organisms/release-track-dialog'
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

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <EntityHero
          title={release.title}
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
          ].filter((item): item is string => Boolean(item))}
        >
        </EntityHero>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <RelationSection
              title="Tracklist"
              count={tracks.length}
              emptyMessage="No tracks available for this release"
            >
              {tracks.length > 0 && (
                <ReleaseTrackDialog
                  tracks={tracks}
                  hasMultipleDiscs={hasMultipleDiscs}
                />
              )}
            </RelationSection>
          </div>

          <div className="space-y-8">
            <RelationSection
              title="All Releases"
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
