class WhisperController {
  constructor(private apiKey: string, private apiBaseURL: string) {}

  authenticate(): void {
    // logic here
  }

  async transcribeAudio(): Promise<string> {
    // logic here
    return "transcription"; // placeholder
  }
}

export default WhisperController;
