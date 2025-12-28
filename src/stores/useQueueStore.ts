import { create } from "zustand";
import { usePlayerStore } from "./usePlayerStore";
import { savePlayerState, loadPlayerState } from "../persistence/playerStorage";
import type { Track } from "../types/Track";

type QueueState = {
  tracks: Track[];
  currentIndex: number;
  history: number[];
  shuffle: boolean;
  repeat: "none" | "one" | "all";

  setQueue: (tracks: Track[], startIndex?: number) => void;
  next: () => void;
  previous: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  select: (index: number) => void;
  rehydrate: () => void;
};

export const useQueueStore = create<QueueState>((set, get) => ({
  tracks: [],
  currentIndex: 0,
  history: [],
  shuffle: false,
  repeat: "none",

  setQueue: (tracks, startIndex = 0) => {
    set({ tracks, currentIndex: startIndex });

    const track = tracks[startIndex];
    if (track) {
      usePlayerStore.getState().setTrack(track);
    }
  },

  next: () => {
    const { tracks, currentIndex, history, shuffle, repeat } = get();
    if (tracks.length === 0) return;

    let nextIndex = currentIndex + 1;

    if (shuffle) {
      const available = tracks
        .map((_, i) => i)
        .filter((i) => i !== currentIndex);

      nextIndex = available[Math.floor(Math.random() * available.length)];
    } else {
      nextIndex = currentIndex + 1;
    }

    if (repeat === "one") {
      nextIndex = currentIndex;
    } else if (repeat === "all" && nextIndex >= tracks.length) {
      nextIndex = 0;
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
    if (!tracks[index]) return;

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
    tracks: Track[]
    currentIndex: number
    shuffle: boolean
    repeat: "none" | "one" | "all"
  }>()

  if (!persisted || persisted.tracks.length === 0) return

  set({
    tracks: persisted.tracks,
    currentIndex: persisted.currentIndex,
    shuffle: persisted.shuffle,
    repeat: persisted.repeat,
    history: []
  })

  const track = persisted.tracks[persisted.currentIndex]
  if (track) {
    usePlayerStore.getState().setTrack(track)
  }
  }
}));

useQueueStore.subscribe((state) => {
  savePlayerState({
    tracks: state.tracks,
    currentIndex: state.currentIndex,
    shuffle: state.shuffle,
    repeat: state.repeat
  })
})
