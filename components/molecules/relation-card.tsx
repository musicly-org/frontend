import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RelationCardProps {
  href?: string
  title: string
  subtitle?: string
  metadata?: string
  imageUrl?: string
  imageAlt?: string
  badge?: string
  current?: boolean
  defaultVersion?: boolean
}

export function RelationCard({
  href,
  title,
  subtitle,
  metadata,
  imageUrl,
  imageAlt,
  badge,
  current = false,
  defaultVersion = false,
}: RelationCardProps) {
  const badges = [
    badge ?? (current ? 'Current' : undefined),
    defaultVersion ? 'Default' : undefined,
  ].filter((item): item is string => Boolean(item))

  const cardClassName = cn(
    'group flex items-center gap-4 p-4 -mx-4 rounded-xl transition-all duration-300',
    current
      ? 'bg-accent/10 ring-1 ring-accent/30'
      : href
        ? 'hover:bg-card-hover'
        : 'cursor-default',
  )

  const chevronClassName = cn(
    'h-5 w-5 shrink-0 transition-all duration-300',
    current ? 'text-accent' : 'text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5',
    !href && 'hidden',
  )

  const content = (
    <>
      {imageUrl ? (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-elevated shadow-lg ring-1 ring-white/5">
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="64px"
          />
        </div>
      ) : (
        <div className="h-16 w-16 shrink-0 rounded-lg bg-surface-elevated flex items-center justify-center shadow-lg ring-1 ring-white/5">
          <span className="text-xl font-serif text-muted-foreground/40">
            {title.charAt(0)}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <h3 className={cn(
            'font-medium truncate transition-colors duration-300',
            current ? 'text-accent' : 'text-foreground group-hover:text-accent',
          )}>
            {title}
          </h3>
          {badges.length > 0 && (
            <div className="flex shrink-0 items-center gap-1.5">
              {badges.map((item) => (
                <span
                  key={item}
                  className={cn(
                    'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium',
                    item === 'Current'
                      ? 'bg-accent/15 text-accent'
                      : 'bg-surface-elevated text-muted-foreground',
                  )}
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground truncate mt-0.5">{subtitle}</p>
        )}
        {metadata && (
          <p className="text-xs text-muted-foreground/60 mt-1">{metadata}</p>
        )}
      </div>
      <ChevronRight className={chevronClassName} />
    </>
  )

  return href ? (
    <Link
      href={href}
      aria-current={current ? 'page' : undefined}
      className={cardClassName}
    >
      {content}
    </Link>
  ) : (
    <div className={cardClassName}>
      {content}
    </div>
  )
}

interface ArtistCardProps {
  href: string
  name: string
  imageUrl?: string
  albumCount?: number
}

export function ArtistCard({ href, name, imageUrl, albumCount }: ArtistCardProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl bg-surface-elevated ring-1 ring-white/5 hover:ring-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5"
    >
      <div className="aspect-square relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-background flex items-center justify-center">
            <span className="text-5xl font-serif text-muted-foreground/20">
              {name.charAt(0)}
            </span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60" />
        
        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-xl shadow-accent/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-accent-foreground fill-current ml-0.5" />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate group-hover:text-accent transition-colors duration-300">
          {name}
        </h3>
        {albumCount !== undefined && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {albumCount} {albumCount === 1 ? 'release' : 'releases'}
          </p>
        )}
      </div>
    </Link>
  )
}

interface ReleaseCardProps {
  href: string
  title: string
  artist?: string
  imageUrl?: string
  year?: number
  type?: string
}

export function ReleaseCard({ href, title, artist, imageUrl, year, type }: ReleaseCardProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-xl bg-surface-elevated ring-1 ring-white/5 hover:ring-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5"
    >
      <div className="aspect-square relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-elevated to-background flex items-center justify-center">
            <span className="text-4xl font-serif text-muted-foreground/20">
              {title.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        
        {/* Type badge */}
        {type && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground font-medium ring-1 ring-white/10">
              {type}
            </span>
          </div>
        )}
        
        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-xl shadow-accent/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 text-accent-foreground fill-current ml-0.5" />
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm text-foreground truncate group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          {artist && (
            <p className="text-xs text-muted-foreground truncate">{artist}</p>
          )}
          {artist && year && (
            <span className="text-muted-foreground/40">·</span>
          )}
          {year && (
            <p className="text-xs text-muted-foreground/60">{year}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

interface TrackRowProps {
  href?: string
  number?: number
  title: string
  artist?: string
  duration?: string
  explicit?: boolean
  isPlaying?: boolean
}

export function TrackRow({ href, number, title, artist, duration, explicit, isPlaying }: TrackRowProps) {
  const Wrapper = href ? Link : 'div'
  const wrapperProps = href ? { href } : {}
  
  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200',
        href && 'hover:bg-card-hover cursor-pointer',
        isPlaying && 'bg-accent/10'
      )}
    >
      {number !== undefined && (
        <div className="w-8 text-center">
          <span className={cn(
            'text-sm tabular-nums',
            isPlaying ? 'text-accent font-medium' : 'text-muted-foreground/60 group-hover:text-foreground'
          )}>
            {number}
          </span>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={cn(
            'font-medium truncate transition-colors',
            isPlaying ? 'text-accent' : 'text-foreground group-hover:text-accent'
          )}>
            {title}
          </h4>
          {explicit && (
            <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted-foreground/20 text-muted-foreground">
              E
            </span>
          )}
        </div>
        {artist && (
          <p className="text-sm text-muted-foreground truncate">{artist}</p>
        )}
      </div>
      
      {duration && (
        <span className="text-sm text-muted-foreground/60 tabular-nums">
          {duration}
        </span>
      )}
    </Wrapper>
  )
}
