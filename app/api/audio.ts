// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import client from '@/app/config/apolloClient';
import GetProjectsAndNotes from '@/app/graphql/queries/GetProjectsAndNotes.graphql';

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
 * @param selectedProject - The project to which the audio should be uploaded.
 * @param selectedNote - The note to which the audio should be uploaded.
 * @returns A promise that resolves to an object representing the server's response to the upload request.
 * @throws Will throw an error if the upload is unsuccessful.
 */
export const uploadAudio = async (
  blob: Blob,
  baseURL: string,
  selectedProject: { id: string } | null,
  selectedNote: { id: string } | null,
): Promise<UploadAudioResponse> => {
  // Logging blob info

  const formData = new FormData();
  formData.append('audio', blob, 'myAudioBlob.wav');
  if (selectedProject) formData.append('projectId', selectedProject.id);
  if (selectedNote) formData.append('noteId', selectedNote.id);

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
      query: GetProjectsAndNotes,
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
 * @returns A signed audio URL
 * @throws Will throw an error if the retrieval is unsuccessful.
 */
export const getAudio = async (
  baseURL: string,
  audioURL: string,
): Promise<string> => {
  const data = { key: audioURL };
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

  // Assuming the response is in JSON format
  const responseBody = await response.json();

  if (!responseBody.success || !responseBody.signedURL) {
    throw new Error('Invalid response format');
  }

  return responseBody.signedURL;
};
