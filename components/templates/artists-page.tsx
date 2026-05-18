import { ArtistCard } from '@/components/molecules/relation-card'
import type { Artist } from '@/lib/types'
import { Disc3 } from 'lucide-react'

export interface ArtistsPageArtist extends Artist {
  albumCount: number
}

interface ArtistsPageProps {
  artists: ArtistsPageArtist[]
}

export function ArtistsPage({ artists }: ArtistsPageProps) {
  // Featured artist (first one with an image, or just first)
  const featuredArtist = artists.find(a => a.imageUrl) || artists[0]
  const remainingArtists = artists.filter(a => a.id !== featuredArtist?.id)

  return (
    <div className="min-h-screen">
      <main className="pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-background to-background" />
          
          <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 mb-2">
              <span className="text-xs uppercase tracking-[0.2em] text-accent font-medium">
                Discover
              </span>
              <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Artists
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
              Explore the complete catalog of artists and dive into their discographies
            </p>
            
            {/* Stats bar */}
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center ring-1 ring-white/5">
                  <Disc3 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{artists.length}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Artists</p>
                </div>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {artists.reduce((sum, a) => sum + a.albumCount, 0)}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Releases</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Artist */}
        {featuredArtist && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
            <a 
              href={featuredArtist.routeHref}
              className="group relative block overflow-hidden rounded-3xl bg-surface-elevated ring-1 ring-white/5 hover:ring-accent/30 transition-all duration-500"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image side */}
                <div className="relative aspect-square md:aspect-auto md:h-80">
                  {featuredArtist.imageUrl ? (
                    <img
                      src={featuredArtist.imageUrl}
                      alt={featuredArtist.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-background flex items-center justify-center">
                      <span className="text-8xl font-serif text-muted-foreground/20">
                        {featuredArtist.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/80 hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent md:hidden" />
                </div>
                
                {/* Content side */}
                <div className="relative p-8 flex flex-col justify-center">
                  <span className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-3">
                    Featured Artist
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground group-hover:text-accent transition-colors duration-300 mb-3">
                    {featuredArtist.name}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {featuredArtist.albumCount} {featuredArtist.albumCount === 1 ? 'release' : 'releases'} in catalog
                  </p>
                  <div className="inline-flex items-center gap-2 text-accent font-medium">
                    <span>Explore discography</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </section>
        )}

        {/* All Artists Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-foreground">All Artists</h2>
            <span className="text-sm text-muted-foreground">
              {remainingArtists.length} artists
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {remainingArtists.map((artist) => (
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
