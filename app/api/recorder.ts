export class Recorder {
  private static instance: Recorder | undefined;
  public audioChunks: Blob[] = [];
  public mediaStream: MediaStream | undefined;
  public mediaRecorder: MediaRecorder | undefined;

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
      // Feature is not supported in browser
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
      console.log('Recorder initialized.');
    } catch (error) {
      // Enhanced error handling for permissions
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (error.name === 'NotAllowedError') {
        return Promise.reject(
          new Error(
            'Microphone access is denied. Please allow access to continue.',
          ),
        );
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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

  // Start recording
  startRecording(): any {
    if (!this.mediaRecorder) {
      throw new Error('Media Recorder is not initialized');
    }
    this.audioChunks = [];
    this.mediaRecorder.start();
  }

  // Stop recording
  stopRecording(): Promise<Blob> {
    if (!this.mediaRecorder) {
      throw new Error('Media Recorder is not initialized');
    }
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        return Promise.reject(new Error('Media Recorder is not initialized'));
      }
      const mimeType = this.mediaRecorder.mimeType;

      const onStop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        if (this.audioChunks.length === 0) {
          throw new Error('No audio data recorded.');
        }
        resolve(audioBlob);
        if (this.mediaRecorder) {
          // Cleanup event listener
          this.mediaRecorder.removeEventListener('stop', onStop);
        }
      };
      this.mediaRecorder.addEventListener('stop', onStop);
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
