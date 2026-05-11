import { TrackList, TrackRow, formatDuration } from '@/components/molecules/track-list'
import type { Track } from '@/lib/types'

interface ReleaseTrackDialogProps {
  tracks: Track[]
  hasMultipleDiscs: boolean
}

export function ReleaseTrackDialog({
  tracks,
  hasMultipleDiscs,
}: ReleaseTrackDialogProps) {
  let currentDisc = 0

  return (
    <TrackList>
      {tracks.map((track) => {
        const isFirstOfDisc = track.discNumber !== currentDisc
        if (isFirstOfDisc) {
          currentDisc = track.discNumber
        }

        return (
          <TrackRow
            key={track.id}
            discNumber={track.discNumber}
            trackNumber={track.trackNumber}
            title={track.title}
            duration={formatDuration(track.durationSeconds)}
            showDisc={hasMultipleDiscs}
            isFirstOfDisc={isFirstOfDisc}
            href={track.routeHref}
          />
        )
      })}
    </TrackList>
  )
}
