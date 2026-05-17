import { ArtistCard } from '@/components/molecules/relation-card'
import type { Artist } from '@/lib/types'

export interface ArtistsPageArtist extends Artist {
  albumCount: number
}

interface ArtistsPageProps {
  artists: ArtistsPageArtist[]
}

export function ArtistsPage({ artists }: ArtistsPageProps) {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <span className="h-1 w-8 bg-primary rounded-full" />
                Browse Collection
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Artists
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                Explore the complete catalog of artists and their discographies
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {artists.length} artists
              </span>
            </div>
          </div>
        </section>

        {/* Featured Artist - First one */}
        {artists.length > 0 && (
          <section className="mb-12">
            <FeaturedArtist artist={artists[0]} />
          </section>
        )}

        {/* Artists Grid */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">All Artists</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                href={artist.routeHref}
                name={artist.name}
                imageUrl={artist.imageUrl}
                albumCount={artist.albumCount}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function FeaturedArtist({ artist }: { artist: ArtistsPageArtist }) {
  return (
    <a
      href={artist.routeHref}
      className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-card"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
      {artist.imageUrl && (
        <div 
          className="absolute inset-0 opacity-40 transition-all duration-500 group-hover:opacity-50 group-hover:scale-105"
          style={{
            backgroundImage: `url(${artist.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
          }}
        />
      )}
      <div className="relative flex flex-col md:flex-row md:items-end gap-6 p-6 md:p-10">
        <div className="relative h-40 w-40 md:h-56 md:w-56 shrink-0 overflow-hidden rounded-xl shadow-2xl ring-1 ring-border/10">
          {artist.imageUrl ? (
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-6xl font-light text-muted-foreground/40">
                {artist.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              Featured Artist
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
              {artist.name}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {artist.albumCount} {artist.albumCount === 1 ? 'album' : 'albums'}
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              View discography
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}
