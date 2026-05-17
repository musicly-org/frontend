import { ArtistsPage as ArtistsIndexPage } from '@/components/templates/artists-page'
import { loadArtistsIndex } from '@/lib/catalog-api'
import { AlertCircle } from 'lucide-react'

export default async function HomePage() {
  try {
    const artists = await loadArtistsIndex()
    return <ArtistsIndexPage artists={artists} />
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isBackendUnavailable = errorMessage.includes('Backend request failed') || 
                                  errorMessage.includes('ECONNREFUSED') ||
                                  errorMessage.includes('fetch failed')

    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="mb-12">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <span className="h-1 w-8 bg-primary rounded-full" />
                Browse Collection
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Artists
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                Browse the complete catalog of artists and their discographies
              </p>
            </div>
          </section>

          {/* Error Card */}
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div className="space-y-2">
                <h2 className="font-semibold text-foreground">
                  {isBackendUnavailable ? 'Backend Service Unavailable' : 'Error Loading Data'}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isBackendUnavailable ? (
                    <>
                      The Musicly backend API is not currently running. To use this application, 
                      please start the backend service at{' '}
                      <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground">
                        {process.env.MUSICLY_BACKEND_URL || process.env.NEXT_PUBLIC_MUSICLY_BACKEND_URL || 'http://localhost:8080'}
                      </code>
                      {' '}or configure the <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground">MUSICLY_BACKEND_URL</code> environment variable.
                    </>
                  ) : (
                    errorMessage
                  )}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}
