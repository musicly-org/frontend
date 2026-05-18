import { ArtistsPage as ArtistsIndexPage } from '@/components/templates/artists-page'
import { loadArtistsIndex } from '@/lib/catalog-api'
import { SiteHeader } from '@/components/organisms/site-header'
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
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl">
              Artists
            </h1>
          </div>

          <div className="rounded-2xl bg-surface-elevated ring-1 ring-amber-500/20 p-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {isBackendUnavailable ? 'Backend Service Unavailable' : 'Error Loading Data'}
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  {isBackendUnavailable ? (
                    <>
                      The Musicly backend API is not currently running. Please start the backend service at{' '}
                      <code className="rounded-md bg-surface-elevated px-2 py-0.5 font-mono text-xs text-accent ring-1 ring-white/10">
                        {process.env.MUSICLY_BACKEND_URL || process.env.NEXT_PUBLIC_MUSICLY_BACKEND_URL || 'http://localhost:8080'}
                      </code>
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
