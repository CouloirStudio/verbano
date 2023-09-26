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
