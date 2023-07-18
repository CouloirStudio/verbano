class TranscriptionModel {
	constructor(
		public transcriptionID: number,
		public audioData: Blob,
		public transcript: string,
	) {}

	transcribeAudio() {
		// Logic for transcribing the audio here
	}

	getTranscription() {
		// Logic for getting the transcription here
		return this.transcript;
	}
}

export default TranscriptionModel;
