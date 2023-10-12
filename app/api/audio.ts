import client from '../config/apolloClient';
import { GET_PROJECTS_AND_NOTES } from '../graphql/queries/getNotes';

/**
 * Type representing the structure of the response received
 * after an audio upload request.
 */
type UploadAudioResponse = {
  /** Indicates if the upload was successful */
  success: boolean;
  /** Optional message providing details of the response */
  message?: string;
  /** ID of the note, if the upload was successful */
  noteId?: string;
  /** URL of the uploaded audio, if the upload was successful */
  url?: string;
};

/**
 * Uploads an audio blob to the specified base URL.
 *
 * @param blob - The audio blob to be uploaded.
 * @param baseURL - The base URL to which the audio should be uploaded.
 * @returns A promise that resolves to an object representing the server's response to the upload request.
 * @throws Will throw an error if the upload is unsuccessful.
 */
export const uploadAudio = async (
  blob: Blob,
  baseURL: string,
): Promise<UploadAudioResponse> => {
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

  // If the upload was successful, refetch the projects and notes
  if (data.success) {
    await client.query({
      query: GET_PROJECTS_AND_NOTES,
      fetchPolicy: 'network-only', // Bypass cache to get fresh data
    });
  }

  return data;
};

/**
 * Retrieves an audio file from a given URL.
 *
 * @param baseURL - The base URL from which the audio should be retrieved.
 * @param audioURL - The specific URL of the audio file.
 * @returns A promise that resolves to the audio blob.
 * @throws Will throw an error if the retrieval is unsuccessful.
 */
export const getAudio = async (
  baseURL: string,
  audioURL: string,
): Promise<Blob> => {
  const data = { url: audioURL };

  const response = await fetch(`${baseURL}/audio/retrieve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.blob();
  } else {
    throw new Error('Response not OK. ' + response.statusText);
  }
};
