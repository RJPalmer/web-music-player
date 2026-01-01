import { type ChangeEvent, useRef } from 'react'
import { useQueueStore } from '../../stores/useQueueStore'
import { fileToTrack } from './fileToTrack'

export function UploadButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const addTracks = useQueueStore((state) => state.addTracks)

  function onFilesSelected(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    const tracks = files.map(fileToTrack)
    addTracks(tracks)

    // allow re-selecting same files later
    e.target.value = ''
  }

  return (
    <>
      <button onClick={() => inputRef.current?.click()}>
        Add Files
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        hidden
        onChange={onFilesSelected}
      />
    </>
  )
}