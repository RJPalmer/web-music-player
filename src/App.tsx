import { usePlayerStore } from './stores/usePlayerStore'
import { useQueueStore } from './stores/useQueueStore'
import { NowPlaying } from './components/NowPlaying'
import type { Track } from './types/Track'


function App() {

  const { isPlaying, play, pause, currentTime, duration, seek, volume, setVolume } = usePlayerStore()
  const { setQueue } = useQueueStore()
  const demoTracks: Track[] = [
  {
    id: '1',
    src: '/track1.mp3',
    title: 'Track One',
    artist: 'Local Artist'
  },
  {
    id: '2',
    src: '/track2.mp3',
    title: 'Track Two',
    artist: 'Local Artist'
  },
  {
    id: '3',
    src: '/track3.mp3',
    title: 'Track Three',
    artist: 'Local Artist'
  }
]
  return (
    <div style={{ padding: 20 }}>
      <h1>Web Music Player</h1>

      <NowPlaying />

      <div style={{ height: 20 }} />
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? 'Pause' : 'Play'}
      </button> 

<button
  onClick={() =>
    setQueue(demoTracks)
  }
>
  Load Queue
</button>
      <div>
        <label>Seek</label>
        <input
          type="range"
          min={0}
          max={duration}
          step={1}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
        />
      </div>
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