import { create } from 'zustand'
import { audioService } from '../services/audioService'

type PlayerState = {
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  src: string | null


  setTrack: (trackUrl: string) => void
  loadTrack: (trackUrl: string) => void
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

  setTrack: (trackUrl) => {
    audioService.loadTrack(trackUrl)
    set({ src: trackUrl, currentTime: 0 })
  },
  loadTrack: (trackUrl) => {
    audioService.loadTrack(trackUrl)
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
      audioService.loadTrack('file_example_MP3_700KB.mp3')
      set({ src: 'file_example_MP3_700KB.mp3' })
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
