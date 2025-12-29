import { usePlayerStore } from "../stores/usePlayerStore";
import type { Track } from "../types/Track";

class AudioService {
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = "metadata";

    // Debounced persistence of currentTime (save every ~1s if changed)
    this.audio.addEventListener("timeupdate", () => {
      const time = Math.floor(this.audio.currentTime);
      const last = usePlayerStore.getState().currentTime;
      if (time !== Math.floor(last)) {
        usePlayerStore.setState({ currentTime: this.audio.currentTime });
      }
    });

    this.audio.addEventListener("loadedmetadata", () => {
      usePlayerStore.setState({ duration: this.audio.duration });
    });

    this.audio.addEventListener("ended", () => {
      usePlayerStore.setState({ isPlaying: false });
      import("../stores/useQueueStore").then(({ useQueueStore }) => {
        useQueueStore.getState().next();
      });
    });

    this.audio.addEventListener("play", () => {
      this.updateMediaSession();
    });

    this.audio.addEventListener("pause", () => {
      this.updateMediaSession();
    });

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", async () => {
        await this.play();
        this.updateMediaSession();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        this.pause();
        this.updateMediaSession();
      });

      navigator.mediaSession.setActionHandler("seekbackward", () => {
        this.seek(Math.max(this.audio.currentTime - 10, 0));
      });

      navigator.mediaSession.setActionHandler("seekforward", () => {
        this.seek(
          Math.min(this.audio.currentTime + 10, this.audio.duration || 0)
        );
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        import("../stores/useQueueStore").then(({ useQueueStore }) => {
          useQueueStore.getState().next();
        });
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        import("../stores/useQueueStore").then(({ useQueueStore }) => {
          useQueueStore.getState().previous();
        });
      });
    }
  }
  loadTrack(track: Track) {
    this.audio.src = track.src;
    this.audio.load();

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "Test Track",
        artist: "Local Library",
        album: "Web Music Player",
      });
    }
  }
  async play() {
    try {
      await this.audio.play();
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  }

  pause() {
    this.audio.pause();
  }

  seek(time: number) {
    this.audio.currentTime = time;
  }

  setVolume(volume: number) {
    this.audio.volume = volume;
  }

  get currentTime() {
    return this.audio.currentTime;
  }

  get duration() {
    return this.audio.duration || 0;
  }

  private updateMediaSession() {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.playbackState = this.audio.paused
      ? "paused"
      : "playing";
  }

  on(event: keyof HTMLMediaElementEventMap, handler: () => void) {
    this.audio.addEventListener(event, handler);
  }
}

export function getCurrentTime(){
    return audioService.currentTime;
}
export const audioService = new AudioService();
