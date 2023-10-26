/**
 * Function to handle request to backend for transcribing audio.
 * @param audioKey The key of the audio file to be transcribed
 * @param baseURL The base URL of the application, passed for testing purposes.
 * @param noteID The ID of the note to be transcribed, so that it can be updated.
 */
export const transcribe = async (
  audioKey: string,
  baseURL: string,
  noteID: string,
): Promise<string> => {
  // setting request parameters
  const data = { key: audioKey, id: noteID };
  // Sending transcription request to the backend
  const response = await fetch(`${baseURL}/transcription/transcribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Response not OK. ' + response.statusText);
  }

  // get the note object from the response and return it.
  const responseBody = await response.json();
  if (!responseBody.success || !responseBody.transcription) {
    throw new Error('Invalid response format');
  }
  return responseBody.transcription;
};
