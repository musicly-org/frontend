'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="group flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">M</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Musicly
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  isHome 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                Browse
              </Link>
              <button
                className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-full transition-all duration-200 hover:text-foreground hover:bg-secondary/50"
              >
                Charts
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-full transition-all duration-200 hover:text-foreground hover:bg-secondary/50"
              >
                New Releases
              </button>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search button */}
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </button>

            {/* Mobile menu button */}
            <button 
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">Menu</span>
            </button>

            {/* Sign in button - desktop */}
            <button className="hidden sm:flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-all duration-200 hover:bg-foreground/90 hover:scale-105">
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isHome 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Home className="h-4 w-4" />
              Browse
            </Link>
            <button
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:text-foreground hover:bg-secondary/50"
            >
              Charts
            </button>
            <button
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:text-foreground hover:bg-secondary/50"
            >
              New Releases
            </button>
            <div className="pt-2 border-t border-border/50">
              <button className="w-full flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background">
                Sign In
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
