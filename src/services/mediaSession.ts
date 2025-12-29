import type { Track } from '../types/Track'

import { usePlayerStore } from '../stores/usePlayerStore'
import { useQueueStore } from '../stores/useQueueStore'

export function setMediaSessionMetadata(track: Track) {
  if (!('mediaSession' in navigator)) return

  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist ?? '',
    album: track.album ?? '',
    artwork: track.artwork
      ? [{ src: track.artwork, sizes: '512x512', type: 'image/png' }]
      : []
  })
}

export function registerMediaSessionHandlers() {
  if (!('mediaSession' in navigator)) return

  navigator.mediaSession.setActionHandler('play', () => {
    usePlayerStore.getState().play()
  })

  navigator.mediaSession.setActionHandler('pause', () => {
    usePlayerStore.getState().pause()
  })

  navigator.mediaSession.setActionHandler('previoustrack', () => {
    useQueueStore.getState().previous()
  })

  navigator.mediaSession.setActionHandler('nexttrack', () => {
    useQueueStore.getState().next()
  })

  // Optional but recommended
  navigator.mediaSession.setActionHandler('stop', () => {
    usePlayerStore.getState().pause()
  })
}