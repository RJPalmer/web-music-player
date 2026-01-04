import React from "react";
import { usePlayerStore } from "../stores/usePlayerStore";

export function PlaybackControls() {
  const {
    currentTime,
    duration,
    // isPlaying,
    // play,
    // pause,
    volume,
    seek,
    setVolume,
  } = usePlayerStore();

  function formatTime(seconds = 0) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <section className="card playback-controls">
      {/* <div className="playback-transport">
        <button onClick={isPlaying ? pause : play}>
          {isPlaying ? "Pause" : "Play"}
        </button>
    </div> */}
      <div className="playback-sliders">
        <input
          type="range"
          aria-label="Seek"
          min={0}
          max={duration || 0}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => seek(Number(e.target.value))}
        />
        <div className="playback-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="volume-row">
          <input
            type="range"
            aria-label="Volume"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
      </div>
    </section>
  );
}
