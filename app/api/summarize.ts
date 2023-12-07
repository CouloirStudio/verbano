import fetch from 'node-fetch';

/**
 * Function to handle request to backend for summarizing notes.
 * @param notes Array of note objects to be summarized.
 * @param prompt A custom prompt for summary generation
 * @param baseURL The base URL of the application, passed for testing purposes.
 */
export const summarize = async (
  notes: any[], // You might want to define a more specific type for notes
  prompt: string | undefined,
  baseURL: string,
): Promise<string> => {
  if (!notes || notes.length === 0) {
    throw new Error('No notes provided for summarization.');
  }

  // Setting request parameters
  const data = { notes, prompt };

  // Sending summarization request to the backend
  const response = await fetch(`${baseURL}/summaries/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Response not OK. ' + response.statusText);
  }

  // Get the summary text from the response and return it.
  const responseBody = await response.json();
  if (!responseBody.success || !responseBody.summary) {
    throw new Error('Invalid response format');
  }

  return responseBody.summary;
};
