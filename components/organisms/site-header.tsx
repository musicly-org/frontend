'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react'
import { primaryRoleLabel } from '@/lib/auth'
import { useAuth } from '@/components/providers/auth-provider'

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { session, isLoading, logout } = useAuth()
  const [logoutError, setLogoutError] = useState<string | null>(null)

  async function handleLogout() {
    setLogoutError(null)

    try {
      await logout()
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Unable to sign out right now')
    }
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-foreground hover:text-accent transition-colors"
            >
              Musicly
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {!isHome && (
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">All Artists</span>
              </Link>
            )}

            {isLoading ? (
              <div className="h-9 w-28 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <>
                <Link
                  href="/auth"
                  className="hidden sm:flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span className="max-w-40 truncate">{session.displayName || session.email}</span>
                  <span className="text-xs text-muted-foreground">{primaryRoleLabel(session)}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <UserCircle2 className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
        {logoutError && (
          <p className="mt-3 text-sm text-destructive">{logoutError}</p>
        )}
      </div>
    </header>
  )
}
