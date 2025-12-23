import { usePlayerStore } from './stores/usePlayerStore'

function App() {
  const { isPlaying, play, pause, volume, setVolume } = usePlayerStore()

  return (
    <div style={{ padding: 20 }}>
      <h1>Web Music Player</h1>

      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <div>
        <label>Volume</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  )
}

export default App