/**
 * Represents an audio recorder for capturing audio from the user's microphone.
 * Implements the Singleton design pattern to ensure only one instance of the recorder exists.
 */
export class AudioRecorder {
  private static instance: AudioRecorder | undefined;
  public audioChunks: Blob[] = [];
  public mediaStream: MediaStream | undefined;
  public mediaRecorder: MediaRecorder | undefined;

  /**
   * Private constructor to prevent direct construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * Gets the singleton instance of the AudioRecorder.
   * @returns The singleton instance of the AudioRecorder.
   */
  public static getRecorder(): AudioRecorder {
    if (!AudioRecorder.instance) {
      AudioRecorder.instance = new AudioRecorder();
    }
    return AudioRecorder.instance;
  }

  /**
   * Initializes the audio recorder by requesting access to the user's microphone.
   * @throws Will throw an error if the browser does not support audio recording
   * or if access to the microphone is denied.
   */
  async initialize(): Promise<void> {
    // Check if the feature is supported in the browser
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      return Promise.reject(
        new Error('Your browser does not support audio recording.'),
      );
    }

    try {
      // Get the microphone stream from the browser.
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      // Create a MediaRecorder object
      this.mediaRecorder = new MediaRecorder(this.mediaStream);

      // Add event that catches audio chunks from the recorder.
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
    } catch (error) {
      // Enhanced error handling for permissions
      if (error.name === 'NotAllowedError') {
        return Promise.reject(
          new Error(
            'Microphone access is denied. Please allow access to continue.',
          ),
        );
      } else {
        if (error.name === 'NotFoundError') {
          return Promise.reject(
            new Error('No microphone found on this device.'),
          );
        } else {
          return Promise.reject(
            new Error(
              'Cannot access the microphone. Please ensure you have a working microphone and try again.',
            ),
          );
        }
      }
    }
  }

  /**
   * Starts recording audio from the user's microphone.
   * @throws Will throw an error if the MediaRecorder is not initialized.
   */
  startRecording(): any {
    if (!this.mediaRecorder) {
      throw new Error('Media Recorder is not initialized');
    }
    // making sure that chunks are reset
    this.audioChunks = [];
    this.mediaRecorder.start();
  }

  /**
   * Stops the recording and returns the captured audio as a Blob.
   * @returns A promise that resolves to a Blob containing the recorded audio.
   * @throws Will throw an error if the MediaRecorder is not initialized or no audio data is recorded.
   */
  stopRecording(): Promise<Blob> {
    if (!this.mediaRecorder) {
      throw new Error('Media Recorder is not initialized');
    }
    // audio chunks get resolved into an audio blob
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        return Promise.reject(new Error('Media Recorder is not initialized'));
      }
      // getting the mime type for creating the audio blob
      const mimeType = this.mediaRecorder.mimeType;

      // function to be added to the recorder that will trigger when the 'stop' event is fired from the Media Recorder object
      // It is done this way so that it can be added and removed.
      const onStop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        // Checking for no audio
        if (this.audioChunks.length === 0) {
          throw new Error('No audio data recorded.');
        }
        resolve(audioBlob);
        if (this.mediaRecorder) {
          // Cleanup event listener
          this.mediaRecorder.removeEventListener('stop', onStop);
        }
      };
      // attach the event listener we just defined
      this.mediaRecorder.addEventListener('stop', onStop);
      // this will fire the 'stop' event that triggers he onStop
      this.mediaRecorder.stop();
    });
  }

  /**
   * Cleans up resources such as media streams and resets the recorder for the next use.
   */
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
