// The purpose of this class is to abstract the usage of the HTMLAudioElement API

export class AudioPlayer {
  public audio: HTMLAudioElement | undefined;
  public isLoaded: boolean = false;

  public constructor() {}

  // Loads the audio element using a blob url and waits for the data to be loaded.
  public loadAudioPlayer(src: string): Promise<void> {
    return new Promise<void>((resolve) => {
      console.log(src);
      this.audio = new Audio();
      // Making the caller of this method wait for the canPlayThrough event.
      // Which is fired when all the audio is loaded.
      const OnReady = () => {
        console.log('audio ready');
        this.isLoaded = true;
        resolve();
        this.audio?.removeEventListener('canplaythrough', OnReady);
      };
      this.audio.addEventListener('canplaythrough', OnReady);
      this.audio.src = src;
      this.audio.load();
      console.log(this.audio);
    });
  }

  // starts the audio player
  public startAudioPlayer = async (): Promise<void> => {
    if (!this.audio) {
      throw new Error('audio player not initialized.');
    } else if (this.audio) {
      await this.audio.play();
    }
  };

  //pauses the audio player
  public pauseAudioPlayer(): void {
    if (!this.audio) {
      throw new Error('audio player not initialized.');
    } else if (this.audio) {
      this.audio.pause();
    }
  }
}
