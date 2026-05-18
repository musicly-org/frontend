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
  isPlaying?: boolean
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
  isPlaying = false,
}: TrackRowProps) {
  const rowClassName = cn(
    'group flex w-full items-center gap-4 py-3 px-4 -mx-4 rounded-xl transition-all duration-200 text-left',
    isInteractive || href ? 'cursor-pointer hover:bg-card-hover' : '',
    isPlaying && 'bg-accent/10',
  )

  const content = (
    <>
      {/* Track number / Play indicator */}
      <div className="relative w-8 flex items-center justify-center">
        <span className={cn(
          'text-sm tabular-nums transition-opacity',
          isPlaying ? 'text-accent font-medium' : 'text-muted-foreground/60',
          (isInteractive || href) && 'group-hover:opacity-0'
        )}>
          {trackNumber}
        </span>
        {(isInteractive || href) && (
          <Play className={cn(
            'absolute w-4 h-4 fill-current opacity-0 group-hover:opacity-100 transition-opacity',
            isPlaying ? 'text-accent' : 'text-foreground'
          )} />
        )}
      </div>
      
      {/* Title */}
      <span className={cn(
        'flex-1 font-medium truncate transition-colors',
        isPlaying ? 'text-accent' : 'text-foreground group-hover:text-accent'
      )}>
        {title}
      </span>
      
      {/* Duration */}
      {duration && (
        <span className="text-sm tabular-nums text-muted-foreground/60">
          {duration}
        </span>
      )}
    </>
  )

  return (
    <>
      {showDisc && isFirstOfDisc && discNumber && (
        <div className="pt-6 pb-3 first:pt-0">
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
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
    <div className={cn('space-y-1', className)}>
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
