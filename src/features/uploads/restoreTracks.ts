import type { Track } from '../../types/Track'

function normalize(name: string) {
  return name.toLowerCase().replace(/\.[^/.]+$/, '')
}

export function restoreTracksFromFiles(
  tracks: Track[],
  files: File[]
): { restored: Track[]; newTracks: Track[] } {
  const restored: Track[] = []
  const newTracks: Track[] = []

  for (const file of files) {
    const title = normalize(file.name)

    const match = tracks.find(
      (t) =>
        t.available === false &&
        normalize(t.title) === title
    )

    if (match) {
      restored.push({
        ...match,
        src: URL.createObjectURL(file),
        available: true,
      })
    } else {
      newTracks.push({
          id: crypto.randomUUID(),
          src: URL.createObjectURL(file),
          title: normalize(file.name),
          source: 'upload',
          available: true,
          artist: ''
      })
    }
  }

  return { restored, newTracks }
}