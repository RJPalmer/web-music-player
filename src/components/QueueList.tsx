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
    <section className="card queue">
      <div className="queue-content">
        <h3>Up Next</h3>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tracks.map((track: Track, index: number) => {
            const isActive = index === currentIndex
            const isUnavailable = track.available === false

            return (
              <li
                key={track.id}
                onClick={() => {
                  if (!isUnavailable) select(index)
                }}
                style={{
                  padding: '8px 12px',
                  cursor: isUnavailable ? 'not-allowed' : 'pointer',
                  background: isActive ? '#222' : 'transparent',
                  color: isUnavailable ? '#888' : isActive ? '#fff' : 'inherit',
                  opacity: isUnavailable ? 0.5 : 1
                }}
              >
                <div><strong>{track.title}</strong></div>
                {track.artist && <div style={{ fontSize: 12 }}>{track.artist}</div>}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}