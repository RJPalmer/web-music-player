import { useEffect } from 'react'
import { useQueueStore } from './stores/useQueueStore'
import { useKeyboardControls } from './hooks/useKeyboardControls'
import { DropZone } from './components/DropZone'
import { NowPlaying } from './components/NowPlaying'
import { PlaybackControls } from './components/PlaybackControls'
import { UploadButton } from './features/uploads/UploadButton'
import { QueueList } from './components/QueueList'
import { registerMediaSessionHandlers } from './services/mediaSession'
import type { Track } from './types/Track'


function App() {

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
  useKeyboardControls()
  useEffect(() => {
    // Load demo tracks into the queue on mount
    useQueueStore.getState().rehydrate()
    registerMediaSessionHandlers()

  }, [])

  return (
    <DropZone>
      <div style={{ padding: 20 }}>
        <h1>Web Music Player</h1>
        <UploadButton />
        <NowPlaying />
        <PlaybackControls />
        <QueueList />
        <div style={{ height: 20 }} />

        <button
          onClick={() =>
            setQueue(demoTracks)
          }
        >
          Load Queue
        </button>
      </div>
    </DropZone>
  )
}

export default App