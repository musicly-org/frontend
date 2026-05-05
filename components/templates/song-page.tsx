import Link from 'next/link'
import { SiteHeader } from '@/components/organisms/site-header'
import { EntityHero } from '@/components/organisms/entity-hero'
import { RelationSection } from '@/components/organisms/relation-section'
import { RelationCard } from '@/components/molecules/relation-card'
import { formatDuration } from '@/components/molecules/track-list'
import type { Artist, Song, SongVersion } from '@/lib/types'

interface SongPageProps {
  artist?: Artist
  song: Song
  versions: SongVersion[]
}

export function SongPage({ artist, song, versions }: SongPageProps) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <EntityHero
          title={song.title}
          subtitle={artist?.name}
          size="md"
          metadata={[
            song.releasedAt,
            `${versions.length} ${versions.length === 1 ? 'version' : 'versions'}`,
          ].filter((item): item is string => Boolean(item))}
        >
          {artist && (
            <Link
              href={artist.routeHref}
              className="mt-2 inline-flex text-sm text-accent transition-colors hover:text-accent/80"
            >
              View artist
            </Link>
          )}
        </EntityHero>

        <div className="mt-12 max-w-2xl">
          <RelationSection
            title="Versions"
            count={versions.length}
            emptyMessage="No versions available for this song"
          >
            {versions.map((version) => (
              <RelationCard
                key={version.id}
                href={version.routeHref}
                title={version.title}
                subtitle={formatDuration(version.durationSeconds)}
                metadata={version.releasedAt}
              />
            ))}
          </RelationSection>
        </div>
      </main>
    </div>
  )
}
