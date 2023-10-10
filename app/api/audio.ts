export const uploadAudio = async (blob: Blob) => {
  console.log(blob, blob instanceof Blob); // Logging blob info

  const formData = new FormData();
  formData.append('audio', blob, 'myAudioBlob.wav');

  const response = await fetch('http://localhost:3000/audio/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to upload.');
  }
  return data;
};

export const getAudio = async (url: string) => {
  // Create a data object to send as JSON
  const data = { url: url };

  const response = await fetch('http://localhost:3000/audio/retrieve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Specify that you're sending JSON data
    },
    body: JSON.stringify(data), // Convert the data object to a JSON string
  });

  if (response.ok) {
    return response.blob(); // Return the response as a Blob
  } else {
    throw new Error('Response not OK');
  }
};
