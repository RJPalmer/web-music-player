import { usePlayerStore } from '../stores/usePlayerStore'
import { useQueueStore } from '../stores/useQueueStore'

export function NowPlaying() {
  const track = usePlayerStore((state) => state.src)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const play = usePlayerStore((state) => state.play)
  const pause = usePlayerStore((state) => state.pause)

  const next = useQueueStore((state) => state.next)
  const previous = useQueueStore((state) => state.previous)

  if (!track) {
    return <div><strong>Nothing playing</strong></div>
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {/* Artwork */}
      {track.artwork && (
        <img
          src={track.artwork}
          alt={`${track.title} artwork`}
          width={64}
          height={64}
          style={{ objectFit: 'cover' }}
        />
      )}

      {/* Metadata */}
      <div style={{ flex: 1 }}>
        <div><strong>{track.title}</strong></div>
        {track.artist && <div>{track.artist}</div>}
        {track.album && <div>{track.album}</div>}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={previous}>⏮</button>
        <button onClick={isPlaying ? pause : play}>
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <button onClick={next}>⏭</button>
      </div>
    </div>
  )
}