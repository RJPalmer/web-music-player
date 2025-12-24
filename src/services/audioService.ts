import { usePlayerStore } from "../stores/usePlayerStore";

class AudioService {
  private audio: HTMLAudioElement;
  loadTrack(trackUrl: string) {
    this.audio.src = trackUrl;
    this.audio.load();
  }
  getDuration(): number | undefined {
    return this.audio.duration || 0;
  }
  private audio: HTMLAudioElement;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = "metadata";

    this.audio.addEventListener("timeupdate", () => {
      usePlayerStore.setState({ currentTime: this.audio.currentTime });
    });

    this.audio.addEventListener("loadeddata", () => {
      usePlayerStore.setState({ duration: this.audio.duration });
    });

    this.audio.addEventListener("ended", () => {
      usePlayerStore.setState({ isPlaying: false });
    });
  }


  play() {
    this.audio.play();
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
