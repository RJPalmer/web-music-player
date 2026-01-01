import { create } from 'zustand'
import { audioService } from '../services/audioService'
import type { Track } from '../types/Track'
import { setMediaSessionMetadata } from '../services/mediaSession'

type PlayerState = {
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  src: Track | null


  setTrack: (track: Track) => void
  loadTrack: (track: Track) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  seek: (time: number) => void
  seekBy: (delta: number) => void
  setVolume: (volume: number) => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  src: null,

  setTrack: (track) => {
    audioService.loadTrack(track)
    set({ src: track, currentTime: 0 })
    setMediaSessionMetadata(track)
  },
  loadTrack: (track) => {
    audioService.loadTrack(track)
    set({ duration: audioService.duration})
    set({ currentTime: 0 })
  },
  seek: (time) => {
    audioService.seek(time)
    set({ currentTime: time })
  },
  seekBy: (delta) => {
    const { currentTime, duration } = get()
    const nextTime = Math.min(
      Math.max(currentTime + delta, 0),
      duration || currentTime
    )

    audioService.seek(nextTime)
    set({ currentTime: nextTime })
  },
  play: async () => {
    const { src } = get()

    if (!src) {
      // No track selected yet; do nothing
      return
    }

    await audioService.play()
    set({ isPlaying: true })
  },
  pause: () => {
    audioService.pause()
    set({ isPlaying: false })
  },
  togglePlay: () => {
    const { isPlaying, src } = get()

    if (!src) return

    if (isPlaying) {
      audioService.pause()
      set({ isPlaying: false })
    } else {
      audioService.play()
      set({ isPlaying: true })
    }
  },
  setVolume: (volume) => {
    audioService.setVolume(volume)
    set({ volume })
  }
}))
