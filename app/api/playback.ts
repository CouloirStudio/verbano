export class AudioPlayer {
  private static instance: AudioPlayer | undefined;
  public audio: HTMLAudioElement | undefined;

  private constructor() {}

  public getAudioPlayer() {
    if (!AudioPlayer.instance) {
      AudioPlayer.instance = new AudioPlayer();
    }
    return AudioPlayer.instance;
  }

  //initializes the audio element, and waits for the data to be loaded.
  public initializeAudioPlayer(src: string) {
    return new Promise<void>((resolve) => {
      this.audio = new Audio(src);
      const OnReady = () => {
        resolve();
      };
      this.audio.addEventListener('canPlayThrough', OnReady);
    });
  }

  // starts the audio player
  public startAudioPlayer = async () => {
    if (!this.audio) {
      throw new Error('audio player not initialized.');
    } else if (this.audio) {
      await this.audio.play();
    }
  };

  public pauseAudioPlayer() {
    this.audio?.pause();
  }
}
