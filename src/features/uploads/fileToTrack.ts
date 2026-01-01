import type { Track } from "../../types/Track";

function stripExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, "");
}

export function fileToTrack(file: File): Track {
  const src = URL.createObjectURL(file);

  return {
    id: crypto.randomUUID(),
    src,
    title: stripExtension(file.name),
    artist: "Unknown Artist",
    album: "Unknown Album",
    artwork: "",
    duration: 0,
    source: "upload",
  };
}
