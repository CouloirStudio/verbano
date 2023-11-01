/**
 * Representation of the interactions with the HTML5 audio element
 * This uses a reference to an element, without actually embedding the element itself.
 */

export class AudioPlayer {
  public audio: HTMLAudioElement | undefined;
  public isLoaded: boolean = false;

  public constructor() {}

  /**
   * Prepares the audio element for playback.
   * @param signedURL The signed AWS url that will be fed to the audio element.
   */
  public loadAudioPlayer(signedURL: string): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.audio == undefined) this.audio = new Audio();
      // OnReady event that makes the caller of LoadAudioPlayer wait until the audio element is ready for playback.
      // The 'canplay' event is fired when an acceptable amount of the audio is loaded for playback.
      const OnReady = () => {
        this.isLoaded = true;
        resolve();
        this.audio?.removeEventListener('canplay', OnReady);
      };
      this.audio.addEventListener('canplay', OnReady);
      // Disabling the preload attribute, this causes issues in some broswers.
      this.audio.preload = 'none';
      // Setting the audio source to the signed AWS url.
      this.audio.src = signedURL;
      // Initiates the loading of the audio.
      this.audio.load();
    });
  }

  /**
   * Houses the logic/ error handling for starting the audio player.
   */
  public startAudioPlayer = async (): Promise<void> => {
    if (!this.audio) {
      throw new Error('audio player not initialized.');
    } else {
      await this.audio.play();
    }
  };

  /**
   * Pauses the audio player and handles possible error.
   */
  public pauseAudioPlayer(): void {
    if (!this.audio) {
      throw new Error('audio player not initialized.');
    } else {
      this.audio.pause();
    }
  }
}
