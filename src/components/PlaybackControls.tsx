import React from 'react'
import { usePlayerStore } from '../stores/usePlayerStore'

export function PlaybackControls() {
  const {
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    volume,
    seek,
    setVolume
  } = usePlayerStore()

  return (
    <section className="card playback-controls">
      <div className="playback-controls-content">
                <button onClick={isPlaying ? pause : play}>
          {isPlaying ? 'Pause' : 'Play'}
        </button> 
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
        />

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </section>
  )
}