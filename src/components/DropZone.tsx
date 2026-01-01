import { type ReactNode, type DragEvent, useState } from 'react'
import { useQueueStore } from '../stores/useQueueStore'

export function DropZone({ children }: { children: ReactNode }) {
  const restoreOrAddTracks = useQueueStore(
    (state) => state.restoreOrAddTracks
  )

  const [isDragging, setIsDragging] = useState(false)

  function onDragOver(e: DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function onDragLeave() {
    setIsDragging(false)
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('audio/')
    )

    if (files.length > 0) {
      restoreOrAddTracks(files)
    }
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        position: 'relative',
        outline: isDragging ? '2px dashed #666' : 'none'
      }}
    >
      {children}
    </div>
  )
}