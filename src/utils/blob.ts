import type { Track } from "../types/Track";

export function revokeTrackBlob(track?: Track) {
  if (!track) return;

  if (track.source === "upload" && track.src.startsWith("blob:")) {
    URL.revokeObjectURL(track.src);
  }
}