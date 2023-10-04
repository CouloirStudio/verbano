// The purpose of this class is to abstract the usage of the HTMLAudioElement API
// and also handle any errors that may be thrown.

export class AudioPlayer {
  private static instance: AudioPlayer | undefined;
  public audio: HTMLAudioElement | undefined;
  public isLoaded: boolean = false;
  public constructor() {}

  // Loads the audio element using a blob url and waits for the data to be loaded.
  public loadAudioPlayer(src: string) {
    return new Promise<void>((resolve) => {
      this.audio = new Audio(src);
      // Making the caller of this method wait for the canPlayThrough event.
      // Which is fired when all the audio is loaded.
      const OnReady = () => {
        console.log('audio ready');
        this.isLoaded = true;
        resolve();
        this.audio.removeEventListener(onReady);
      };
      this.audio.addEventListener('canplaythrough', OnReady);
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

  //pauses the audio player
  public pauseAudioPlayer() {
    if (!this.audio) {
      throw new Error('audio player not initialized.');
    } else if (this.audio) {
      this.audio.pause();
    }
  }
}
