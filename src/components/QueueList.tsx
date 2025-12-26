import { useQueueStore } from '../stores/useQueueStore'
// import { usePlayerStore } from '../stores/usePlayerStore'
import type { Track } from '../types/Track'

export function QueueList() {
  const tracks = useQueueStore((state) => state.tracks)
  const currentIndex = useQueueStore((state) => state.currentIndex)
const select = useQueueStore((state) => state.select)

  if (tracks.length === 0) {
    return <div>No tracks in queue</div>
  }

  return (
    <div>
      <h3>Up Next</h3>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tracks.map((track: Track, index: number) => {
          const isActive = index === currentIndex

          return (
            <li
              key={track.id}
              onClick={() => {
                select(index)
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                background: isActive ? '#222' : 'transparent',
                color: isActive ? '#fff' : 'inherit'
              }}
            >
              <div><strong>{track.title}</strong></div>
              {track.artist && <div style={{ fontSize: 12 }}>{track.artist}</div>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}