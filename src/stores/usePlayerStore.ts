import { create } from 'zustand'

type PlayerState = {
  isPlaying: boolean
  volume: number

  play: () => void
  pause: () => void
  setVolume: (volume: number) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  volume: 1,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume })
}))