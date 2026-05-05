'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home } from 'lucide-react'

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="text-xl font-semibold tracking-tight text-foreground hover:text-accent transition-colors"
            >
              Musicly
            </Link>
          </div>
          {!isHome && (
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">All Artists</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
