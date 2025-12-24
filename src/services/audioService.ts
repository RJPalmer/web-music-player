import { usePlayerStore } from "../stores/usePlayerStore";

class AudioService {
  private audio: HTMLAudioElement;
  loadTrack(trackUrl: string) {
    this.audio.src = trackUrl;
    this.audio.load();

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "Test Track",
        artist: "Local Library",
        album: "Web Music Player",
      });
    }
  }

  constructor() {
    this.audio = new Audio();
    this.audio.preload = "metadata";

    this.audio.addEventListener("timeupdate", () => {
      usePlayerStore.setState({ currentTime: this.audio.currentTime });
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

export const audioService = new AudioService();
