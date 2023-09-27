export class Recorder {
  private static instance: Recorder | undefined;
  private mediaStream: MediaStream | undefined;
  private mediaRecorder: MediaRecorder | undefined;
  private audioChunks: Blob[] = [];

  // constructor for getting empty Recorder
  private constructor() {}

  //implementing singleton design pattern, as there should not be two recorders at once.
  public static getRecorder(): Recorder {
    if (!Recorder.instance) {
      Recorder.instance = new Recorder();
    }
    return Recorder.instance;
  }

  // Request access to the user's microphone
  async initialize(): Promise<void> {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      //Feature is not supported in browser
      //return a custom error
      return Promise.reject(new Error('Your browser is incompatible.'));
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.mediaRecorder = new MediaRecorder(this.mediaStream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // at a later date if we want to we can set a timeslice so that it gradually sends the audio instead of all at once at the end.
          this.audioChunks.push(event.data);
        }
      };
    } catch (error) {
      // error accessing microphone
      // return custom error
      return Promise.reject(new Error('Cannot access the microphone.'));
    }
  }

  // Start recording
  startRecording(): void {
    if (this.mediaRecorder) {
      this.audioChunks = [];
      this.mediaRecorder.start();
    }
  }

  // Stop recording
  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        throw new Error('Media Recorder is not instantiated.');
      }
      //save mime type to set the Blob type later
      const mimeType = this.mediaRecorder.mimeType;

      //listen to the stop event in order to create & return a single Blob object
      this.mediaRecorder.addEventListener('stop', () => {
        //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });

        if (this.audioChunks.length === 0) {
          throw new Error('No audio data recorded.');
        }
        //resolve promise with the single audio blob representing the recorded audio
        resolve(audioBlob);
      });
      this.mediaRecorder.stop();
    });
  }

  // Clean up resources
  cleanup(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.mediaStream = undefined;
      this.mediaRecorder = undefined;
    }
  }
}
