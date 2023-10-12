export const uploadAudio = async (
  blob: Blob,
  baseURL: string,
): Promise<any> => {
  console.log(blob, blob instanceof Blob); // Logging blob info

  const formData = new FormData();
  formData.append('audio', blob, 'myAudioBlob.wav');

  const response = await fetch(`${baseURL}/audio/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to upload.');
  }
  return data;
};

export const getAudio = async (
  baseURL: string,
  audioURL: string,
): Promise<Blob> => {
  // Create a data object to send as JSON
  const data = { url: audioURL };

  const response = await fetch(`${baseURL}/audio/retrieve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Specify that you're sending JSON data
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
  });

  if (response.ok) {
    return response.blob();
  } else {
    throw new Error('Response not OK. ' + response.statusText);
  }
};
