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
    'group flex items-center gap-4 p-3 -mx-3 rounded-xl transition-all duration-200',
    current
      ? 'bg-primary/10 ring-1 ring-primary/30'
      : href
        ? 'hover:bg-secondary/70'
        : 'cursor-default',
  )

  const chevronClassName = cn(
    'h-5 w-5 shrink-0 transition-all duration-200',
    current ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5',
    !href && 'hidden',
  )

  const content = (
    <>
      <div className="relative">
        {imageUrl ? (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted shadow-lg ring-1 ring-border/10">
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="56px"
            />
          </div>
        ) : (
          <div className="h-14 w-14 shrink-0 rounded-lg bg-muted flex items-center justify-center shadow-lg ring-1 ring-border/10">
            <span className="text-lg font-light text-muted-foreground/60">
              {title.charAt(0)}
            </span>
          </div>
        )}
        {/* Play overlay on hover */}
        {href && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="h-5 w-5 text-primary fill-primary" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            'font-medium truncate transition-colors',
            current ? 'text-primary' : 'text-foreground group-hover:text-primary',
          )}>
            {title}
          </h3>
          {badges.length > 0 && (
            <div className="flex shrink-0 items-center gap-1">
              {badges.map((item) => (
                <span
                  key={item}
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    item === 'Current'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
        )}
        {metadata && (
          <p className="text-xs text-muted-foreground/70">{metadata}</p>
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
      className="group block p-4 rounded-xl bg-card/50 hover:bg-card border border-border/50 hover:border-border transition-all duration-300 hover:shadow-xl hover:shadow-background/50 hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="relative">
          {imageUrl ? (
            <div className="relative h-28 w-28 overflow-hidden rounded-full bg-muted shadow-xl ring-2 ring-border/10 group-hover:ring-primary/30 transition-all duration-300">
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="112px"
              />
            </div>
          ) : (
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center shadow-xl ring-2 ring-border/10 group-hover:ring-primary/30 transition-all duration-300">
              <span className="text-4xl font-light text-muted-foreground/50">
                {name.charAt(0)}
              </span>
            </div>
          )}
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
              <Play className="h-4 w-4 text-primary-foreground fill-primary-foreground ml-0.5" />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate max-w-full">
            {name}
          </h3>
          {albumCount !== undefined && (
            <p className="text-xs text-muted-foreground">
              {albumCount} {albumCount === 1 ? 'album' : 'albums'}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
