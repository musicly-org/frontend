import { cn } from '@/lib/utils'

interface TrackRowProps {
  discNumber?: number
  trackNumber: number
  title: string
  duration?: string
  showDisc?: boolean
  isFirstOfDisc?: boolean
}

export function TrackRow({
  discNumber,
  trackNumber,
  title,
  duration,
  showDisc = false,
  isFirstOfDisc = false,
}: TrackRowProps) {
  return (
    <>
      {showDisc && isFirstOfDisc && discNumber && (
        <div className="pt-4 pb-2 first:pt-0">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Disc {discNumber}
          </span>
        </div>
      )}
      <div className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0 group hover:bg-muted/30 -mx-2 px-2 rounded transition-colors">
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
      </div>
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
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
