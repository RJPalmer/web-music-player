import { create } from 'zustand'
import { audioService } from '../services/audioService'
import type { Track } from '../types/Track'

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
  seek: (time: number) => void
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
  setVolume: (volume) => {
    audioService.setVolume(volume)
    set({ volume })
  }
}))
