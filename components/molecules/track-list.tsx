import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Play } from 'lucide-react'

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
    'flex w-full items-center gap-4 py-3 px-4 transition-all duration-200 text-left group',
    isInteractive || href 
      ? 'cursor-pointer hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-ring/40' 
      : '',
  )

  const content = (
    <>
      {/* Track number with play icon on hover */}
      <span className="w-8 text-right text-sm tabular-nums text-muted-foreground shrink-0 relative">
        <span className="group-hover:hidden">{trackNumber}</span>
        <span className="hidden group-hover:block">
          <Play className="h-3.5 w-3.5 text-primary fill-primary ml-auto" />
        </span>
      </span>
      
      {/* Title */}
      <span className="flex-1 font-medium text-foreground truncate group-hover:text-primary transition-colors">
        {title}
      </span>
      
      {/* Duration */}
      {duration && (
        <span className="text-sm tabular-nums text-muted-foreground shrink-0">
          {duration}
        </span>
      )}
    </>
  )

  return (
    <>
      {showDisc && isFirstOfDisc && discNumber && (
        <div className="px-4 pt-6 pb-2 first:pt-4 border-t border-border/50 first:border-0">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
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
    <div className={cn('divide-y divide-border/30', className)}>
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
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
