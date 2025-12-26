import { usePlayerStore } from '../stores/usePlayerStore'

export function NowPlaying() {
  const track = usePlayerStore((state) => state.src)

  if (!track) {
    return (
      <div>
        <strong>Nothing playing</strong>
      </div>
    )
  }

  return (
    <div>
      <div>
        <strong>{track.title}</strong>
      </div>

      {track.artist && (
        <div>{track.artist}</div>
      )}

      {track.album && (
        <div>{track.album}</div>
      )}

      {track.artwork && (
  <img
    src={track.artwork}
    alt={`${track.title} artwork`}
    width={96}
    height={96}
    style={{ objectFit: 'cover' }}
  />
)}
    </div>
  )
}