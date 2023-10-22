export const transcribe = async (
  audioKey: string,
  baseURL: string,
): Promise<string> => {
  const data = { key: audioKey };
  console.log('Sending transcription fetch to backend');
  const response = await fetch(`${baseURL}/audio/retrieve`, {
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
  if (!responseBody.success || !responseBody.note) {
    throw new Error('Invalid response format');
  }
  return responseBody.note;
};
