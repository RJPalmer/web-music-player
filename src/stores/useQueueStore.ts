import { create } from 'zustand'
import { usePlayerStore } from './usePlayerStore'
import type { Track } from '../types/Track'

type QueueState = {
  tracks: Track[]
  currentIndex: number

  setQueue: (tracks: Track[], startIndex?: number) => void
  next: () => void
  previous: () => void
}

export const useQueueStore = create<QueueState>((set, get) => ({
  tracks: [],
  currentIndex: 0,

  setQueue: (tracks, startIndex = 0) => {
    set({ tracks, currentIndex: startIndex })

    const track = tracks[startIndex]
    if (track) {
      usePlayerStore.getState().setTrack(track)
    }
  },

  next: () => {
    const { tracks, currentIndex } = get()
    const nextIndex = currentIndex + 1

    if (nextIndex >= tracks.length) return

    set({ currentIndex: nextIndex })
    usePlayerStore.getState().setTrack(tracks[nextIndex])
    usePlayerStore.getState().play()
  },

  previous: () => {
    const { tracks, currentIndex } = get()
    const prevIndex = currentIndex - 1

    if (prevIndex < 0) return

    set({ currentIndex: prevIndex })
    usePlayerStore.getState().setTrack(tracks[prevIndex])
    usePlayerStore.getState().play()
  }
}))