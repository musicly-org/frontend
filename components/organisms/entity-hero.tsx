import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Play, Shuffle } from 'lucide-react'

interface EntityHeroProps {
  title: string
  subtitle?: React.ReactNode
  metadata?: string[]
  imageUrl?: string
  imageAlt?: string
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
  showPlayButton?: boolean
}

export function EntityHero({
  title,
  subtitle,
  metadata = [],
  imageUrl,
  imageAlt,
  size = 'md',
  children,
  showPlayButton = true,
}: EntityHeroProps) {
  const imageSizes = {
    sm: 'h-32 w-32 sm:h-40 sm:w-40',
    md: 'h-40 w-40 sm:h-52 sm:w-52',
    lg: 'h-48 w-48 sm:h-64 sm:w-64',
  }

  return (
    <section className="relative">
      {/* Background gradient based on image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {imageUrl && (
          <div
            className="absolute inset-0 opacity-30 blur-3xl scale-150"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 relative">
        {/* Image with play button overlay */}
        <div className="relative group">
          {imageUrl ? (
            <div className={cn(
              'relative shrink-0 overflow-hidden rounded-xl bg-muted shadow-2xl ring-1 ring-border/10',
              imageSizes[size]
            )}>
              <Image
                src={imageUrl}
                alt={imageAlt || title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 192px, 256px"
                priority
              />
              {/* Hover overlay with play */}
              {showPlayButton && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/30 transition-transform hover:scale-110">
                    <Play className="h-6 w-6 text-primary-foreground fill-primary-foreground ml-1" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={cn(
              'shrink-0 rounded-xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center shadow-2xl ring-1 ring-border/10',
              imageSizes[size]
            )}>
              <span className="text-6xl sm:text-7xl font-light text-muted-foreground/30">
                {title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-end gap-4 pb-2">
          {subtitle && (
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              {subtitle}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance leading-none">
            {title}
          </h1>
          {metadata.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {metadata.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                  {item}
                  {index < metadata.length - 1 && (
                    <span className="text-border">·</span>
                  )}
                </span>
              ))}
            </div>
          )}
          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button className="flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-200 hover:bg-primary/90 hover:scale-105">
              <Play className="h-5 w-5 fill-primary-foreground" />
              Play
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground hover:border-muted-foreground/30">
              <Shuffle className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}
