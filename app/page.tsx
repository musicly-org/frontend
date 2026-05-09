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
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="mb-8">
            <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Artists
            </h1>
            <p className="text-muted-foreground">
              Browse the complete catalog of artists and their discographies
            </p>
          </section>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="space-y-2">
                <h2 className="font-semibold text-amber-900 dark:text-amber-100">
                  {isBackendUnavailable ? 'Backend Service Unavailable' : 'Error Loading Data'}
                </h2>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {isBackendUnavailable ? (
                    <>
                      The Musicly backend API is not currently running. To use this application, 
                      please start the backend service at{' '}
                      <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-900">
                        {process.env.MUSICLY_BACKEND_URL || process.env.NEXT_PUBLIC_MUSICLY_BACKEND_URL || 'http://localhost:8080'}
                      </code>
                      {' '}or configure the <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-900">MUSICLY_BACKEND_URL</code> environment variable.
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
