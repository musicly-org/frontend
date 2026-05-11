import Link from 'next/link'
import { cn } from '@/lib/utils'

interface TrackRowProps {
  discNumber?: number
  trackNumber: number
  title: string
  duration?: string
  showDisc?: boolean
  isFirstOfDisc?: boolean
  href?: string
  target?: string
  isInteractive?: boolean
  dataTrackId?: string
  dataEmbedUrl?: string
}

export function TrackRow({
  discNumber,
  trackNumber,
  title,
  duration,
  showDisc = false,
  isFirstOfDisc = false,
  href,
  target,
  isInteractive = false,
  dataTrackId,
  dataEmbedUrl,
}: TrackRowProps) {
  const rowClassName = cn(
    'flex w-full items-center gap-4 border-b border-border/50 py-3 transition-colors last:border-0 -mx-2 rounded px-2 text-left',
    isInteractive ? 'group cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/40' : 'group',
    isInteractive ? 'hover:bg-muted/30' : '',
  )

  const content = (
    <>
      <span className="w-8 text-right text-sm tabular-nums text-muted-foreground">
        {trackNumber}
      </span>
      <span className="flex-1 font-medium text-foreground truncate">
        {title}
      </span>
      {duration && (
        <span className="text-sm tabular-nums text-muted-foreground">
          {duration}
        </span>
      )}
    </>
  )

  return (
    <>
      {showDisc && isFirstOfDisc && discNumber && (
        <div className="pt-4 pb-2 first:pt-0">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Disc {discNumber}
          </span>
        </div>
      )}
      {href ? (
        target ? (
          <a
            href={href}
            target={target}
            className={rowClassName}
            data-track-row=""
            data-track-id={dataTrackId}
            data-embed-url={dataEmbedUrl}
          >
            {content}
          </a>
        ) : (
          <Link href={href} scroll={false} className={rowClassName}>
            {content}
          </Link>
        )
      ) : (
        <button
          type="button"
          className={rowClassName}
          disabled={!isInteractive}
        >
          {content}
        </button>
      )}
    </>
  )
}

interface TrackListProps {
  children: React.ReactNode
  className?: string
}

export function TrackList({ children, className }: TrackListProps) {
  return (
    <div className={cn('divide-y divide-transparent', className)}>
      {children}
    </div>
  )
}

export function formatDuration(seconds?: number | null): string | undefined {
  if (seconds === undefined || seconds === null) {
    return undefined
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
