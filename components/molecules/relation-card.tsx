import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
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
    'group flex items-center gap-4 p-3 -mx-3 rounded-lg transition-colors',
    current
      ? 'bg-accent/10 ring-1 ring-accent/25'
      : href
        ? 'hover:bg-muted/50'
        : 'cursor-default',
  )

  const chevronClassName = cn(
    'h-5 w-5 shrink-0 transition-colors',
    current ? 'text-accent' : 'text-muted-foreground/40 group-hover:text-accent',
    !href && 'hidden',
  )

  const content = (
    <>
      {imageUrl ? (
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted shadow-sm">
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-md bg-muted flex items-center justify-center shadow-sm">
          <span className="text-lg font-light text-muted-foreground/60">
            {title.charAt(0)}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            'font-medium truncate transition-colors',
            current ? 'text-accent' : 'text-foreground group-hover:text-accent',
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
                      ? 'bg-accent/10 text-accent'
                      : 'bg-muted text-muted-foreground',
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
          <p className="text-xs text-muted-foreground/80">{metadata}</p>
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
      className="group block p-4 rounded-lg bg-card border border-border hover:border-accent/30 hover:shadow-md transition-all"
    >
      <div className="flex flex-col items-center text-center gap-3">
        {imageUrl ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted shadow-md">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        ) : (
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center shadow-md">
            <span className="text-3xl font-light text-muted-foreground/40">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
            {name}
          </h3>
          {albumCount !== undefined && (
            <p className="text-sm text-muted-foreground">
              {albumCount} {albumCount === 1 ? 'album' : 'albums'}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
