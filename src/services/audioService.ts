import { usePlayerStore } from "../stores/usePlayerStore";

class AudioService {
  private audio: HTMLAudioElement;
  loadTrack(trackUrl: string) {
    this.audio.src = trackUrl;
    this.audio.load();
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
    });
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

  on(event: keyof HTMLMediaElementEventMap, handler: () => void) {
    this.audio.addEventListener(event, handler);
  }
}

export const audioService = new AudioService();
