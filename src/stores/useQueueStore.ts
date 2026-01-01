import { create } from "zustand";
import { usePlayerStore } from "./usePlayerStore";
import { restoreTracksFromFiles } from "../features/uploads/restoreTracks";
import { revokeTrackBlob } from "../utils/blob";
import { savePlayerState, loadPlayerState } from "../persistence/playerStorage";
import type { Track } from "../types/Track";
import { setMediaSessionMetadata } from "../services/mediaSession";

type QueueState = {
  addTracks: (tracks: Track[]) => void;
  currentIndex: number;
  history: number[];
  next: () => void;
  previous: () => void;
  repeat: "none" | "one" | "all";
  rehydrate: () => void;
  removeTrack: (index: number) => void;
  restoreOrAddTracks: (files: File[]) => void;
  select: (index: number) => void;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  shuffle: boolean;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  tracks: Track[];
};

export const useQueueStore = create<QueueState>((set, get) => ({
  tracks: [],
  currentIndex: 0,
  history: [],
  shuffle: false,
  repeat: "none",

  setQueue: (tracks, startIndex = 0) => {
    const prevTracks = get().tracks;
    prevTracks.forEach(revokeTrackBlob);

    set({ tracks, currentIndex: startIndex });

    const track = tracks[startIndex];
    if (track) {
      usePlayerStore.getState().setTrack(track);
    }
  },

  next: () => {
    const { tracks, currentIndex, history, shuffle, repeat } = get();
    if (tracks.length === 0) return;

    const playableIndexes = tracks
      .map((t, i) => (t.available === false ? null : i))
      .filter((i): i is number => i !== null);

    if (playableIndexes.length === 0) return;

    let nextIndex = currentIndex + 1;

    if (shuffle) {
      const candidates = playableIndexes.filter((i) => i !== currentIndex);
      nextIndex = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      const currentPos = playableIndexes.indexOf(currentIndex);
      nextIndex = playableIndexes[currentPos + 1];
    }

    if (repeat === "one") {
      nextIndex = currentIndex;
    } else if (repeat === "all" && nextIndex === undefined) {
      nextIndex = playableIndexes[0];
    } else if (nextIndex === undefined) {
      return;
    }

    set({ currentIndex: nextIndex, history: [...history, currentIndex] });
    usePlayerStore.getState().setTrack(tracks[nextIndex]);
    usePlayerStore.getState().play();
  },

  previous: () => {
    const { history, tracks } = get();
    if (history.length === 0) return;

    const prevIndex = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    set({
      currentIndex: prevIndex,
      history: newHistory,
    });

    usePlayerStore.getState().setTrack(tracks[prevIndex]);
    usePlayerStore.getState().play();
  },

  select: (index: number) => {
    const { tracks, currentIndex, history } = get();
    if (!tracks[index] || tracks[index].available === false) return;

    set({ currentIndex: index, history: [...history, currentIndex] });
    usePlayerStore.getState().setTrack(tracks[index]);
    usePlayerStore.getState().play();
  },

  toggleShuffle: () => {
    set((state) => ({ shuffle: !state.shuffle }));
  },

  toggleRepeat: () => {
    set((state) => {
      const nextRepeat =
        state.repeat === "none"
          ? "all"
          : state.repeat === "all"
          ? "one"
          : "none";
      return { repeat: nextRepeat };
    });
  },

  rehydrate: async () => {
    const persisted = await loadPlayerState<{
      tracks: Track[];
      currentIndex: number;
      shuffle: boolean;
      repeat: "none" | "one" | "all";
    }>();

    if (!persisted || persisted.tracks.length === 0) return;

    const restoredTracks = persisted.tracks.map((track) => {
      if (track.source === "upload") {
        return { ...track, available: false };
      }
      return track;
    });

    set({
      tracks: restoredTracks,
      currentIndex: persisted.currentIndex,
      shuffle: persisted.shuffle,
      repeat: persisted.repeat,
      history: [],
    });

    const track = restoredTracks[persisted.currentIndex];
    if (track) {
      usePlayerStore.getState().setTrack(track);
      setMediaSessionMetadata(track);
    }
  },

  removeTrack: (index) => {
    const { tracks, currentIndex } = get();
    const track = tracks[index];

    revokeTrackBlob(track);

    const nextTracks = tracks.filter((_, i) => i !== index);

    let nextIndex = currentIndex;
    if (index < currentIndex) nextIndex--;
    if (nextIndex < 0) nextIndex = 0;

    set({
      tracks: nextTracks,
      currentIndex: nextIndex,
    });
  },
  restoreOrAddTracks: (files) => {
    const { tracks, currentIndex } = get();

    const { restored, newTracks } = restoreTracksFromFiles(tracks, files);

    if (restored.length === 0 && newTracks.length === 0) return;

    const updatedTracks = tracks.map((t) => {
      const replacement = restored.find((r) => r.id === t.id);

      if (replacement && t.src !== replacement.src) {
        revokeTrackBlob(t);
      }

      return replacement ?? t;
    });

    const finalTracks = [...updatedTracks, ...newTracks];

    set({ tracks: finalTracks });

    // If current track was restored, rebind it
    const current = finalTracks[currentIndex];
    if (current?.available) {
      usePlayerStore.getState().setTrack(current);
    }
  },

  addTracks: (newTracks: Track[]) => {
    const { tracks } = get();

    if (tracks.length === 0) {
      set({ tracks: newTracks, currentIndex: 0, history: [] });

      usePlayerStore.getState().setTrack(newTracks[0]);
      return;
    }

    set({ tracks: [...tracks, ...newTracks] });
  },
}));

useQueueStore.subscribe((state) => {
  savePlayerState({
    tracks: state.tracks,
    currentIndex: state.currentIndex,
    shuffle: state.shuffle,
    repeat: state.repeat,
  });
});
