'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LogOut, UserCircle2, Menu, X } from 'lucide-react'
import { primaryRoleLabel } from '@/lib/auth'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { session, isLoading, logout } = useAuth()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleLogout() {
    setLogoutError(null)

    try {
      await logout()
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Unable to sign out right now')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 transition-all group-hover:bg-accent/20 group-hover:shadow-lg group-hover:shadow-accent/10">
              <span className="font-serif text-lg font-bold text-accent">M</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
              Musicly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {!isHome && (
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                <span>Discover</span>
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-3 md:flex">
            {isLoading ? (
              <div className="h-9 w-28 animate-pulse rounded-full bg-secondary" />
            ) : session ? (
              <>
                <Link
                  href="/auth"
                  className="flex items-center gap-2.5 rounded-full bg-secondary/80 px-4 py-2 text-sm transition-all hover:bg-secondary"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
                    <span className="text-xs font-semibold text-accent">
                      {(session.displayName || session.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="max-w-32 truncate font-medium text-foreground">
                    {session.displayName || session.email}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {primaryRoleLabel(session)}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30"
              >
                <UserCircle2 className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80 md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-out md:hidden',
            mobileMenuOpen ? 'max-h-80 pb-6' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col gap-2 pt-4">
            {!isHome && (
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <Home className="h-5 w-5 text-muted-foreground" />
                <span>Discover</span>
              </Link>
            )}
            
            {isLoading ? (
              <div className="h-12 animate-pulse rounded-xl bg-secondary" />
            ) : session ? (
              <>
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                    <span className="text-sm font-semibold text-accent">
                      {(session.displayName || session.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="block truncate">{session.displayName || session.email}</span>
                    <span className="text-xs text-muted-foreground">{primaryRoleLabel(session)}</span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    void handleLogout()
                  }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <UserCircle2 className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </nav>
        </div>

        {logoutError && (
          <p className="py-2 text-sm text-destructive">{logoutError}</p>
        )}
      </div>
    </header>
  )
}
