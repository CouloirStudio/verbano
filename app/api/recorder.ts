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
      // Feature is not supported in browser
      return Promise.reject(
        new Error('Your browser does not support audio recording.'),
      );
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      this.mediaRecorder = new MediaRecorder(this.mediaStream);

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
      } else if (error.name === 'NotFoundError') {
        return Promise.reject(new Error('No microphone found on this device.'));
      } else {
        // General error accessing microphone
        return Promise.reject(
          new Error(
            'Cannot access the microphone. Please ensure you have a working microphone and try again.',
          ),
        );
      }
    }
  }

  // Start recording
  startRecording(): void {
    if (this.mediaRecorder) {
      this.audioChunks = [];
      this.mediaRecorder.start();
    }
  }

  //...existing code

  // Stop recording
  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        throw new Error('Media Recorder is not instantiated.');
      }
      const mimeType = this.mediaRecorder.mimeType;

      const onStop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        if (this.audioChunks.length === 0) {
          throw new Error('No audio data recorded.');
        }
        resolve(audioBlob);

        // Cleanup event listener
        this.mediaRecorder.removeEventListener('stop', onStop);
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
