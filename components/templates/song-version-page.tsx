import Link from 'next/link'
import { SiteHeader } from '@/components/organisms/site-header'
import { EntityHero } from '@/components/organisms/entity-hero'
import { formatDuration } from '@/components/molecules/track-list'
import type { Artist, Song, SongVersion } from '@/lib/types'

interface SongVersionPageProps {
  artist?: Artist
  song: Song
  version: SongVersion
}

export function SongVersionPage({ artist, song, version }: SongVersionPageProps) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <EntityHero
          title={version.title}
          subtitle={artist?.name}
          size="md"
          metadata={[
            formatDuration(version.durationSeconds),
            version.releasedAt,
          ].filter((item): item is string => Boolean(item))}
        >
          <div className="mt-4 flex items-center gap-4">
            <Link
              href={song.routeHref}
              className="text-sm text-accent transition-colors hover:text-accent/80"
            >
              View all versions
            </Link>
            {artist && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <Link
                  href={artist.routeHref}
                  className="text-sm text-accent transition-colors hover:text-accent/80"
                >
                  View artist
                </Link>
              </>
            )}
          </div>
        </EntityHero>

        <div className="mt-12 max-w-2xl">
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="mb-1 text-sm text-muted-foreground">Duration</p>
                <p className="font-medium text-foreground tabular-nums">
                  {formatDuration(version.durationSeconds) ?? 'Unknown'}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="mb-1 text-sm text-muted-foreground">Released</p>
                <p className="font-medium text-foreground">{version.releasedAt ?? 'Unknown'}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
