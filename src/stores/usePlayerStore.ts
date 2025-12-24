import { create } from 'zustand'
import { audioService } from '../services/audioService'

type PlayerState = {
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number

  
  loadTrack: (trackUrl: string) => void
  play: () => void
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  loadTrack: (trackUrl) => {
    audioService.loadTrack(trackUrl)
    set({ duration: audioService.getDuration() })
    set({ currentTime: 0 })
  },
  seek: (time) => {
    audioService.seek(time)
    set({ currentTime: time })
  },
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume })
}))