class TranscriptionController {
	constructor(
		private readonly audioData: Blob = new Blob(),
		private readonly transcript: string = '',
	) {}

	async transcribeAudio(): Promise<string> {
		// Logic to transcribe audio here
		return 'transcription'; // Placeholder
	}

	async cleanTranscription(): Promise<string> {
		// Logic to clean transcription here
		return 'clean transcription'; // Placeholder
	}

	getTranscription(): string {
		// Logic to get transcription here
		return this.transcript; // Placeholder
	}
}

export default TranscriptionController;
