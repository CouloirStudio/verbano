import express from 'express';
import { generatePresignedUrl } from '../services/AWSService';
import OpenAIService from '../services/OpenAIService';
import { NoteMutations } from '../resolvers/NoteResolvers';
import { updateTranscriptionArgs } from '../resolvers/types';

const router = express.Router();

/**
 * Endpoint to transcribe audio
 */
router.post('/transcribe', async (req, res) => {
  console.log('inside transcription route');
  try {
    const data = req.body;
    const key = data.key;
    const noteID = data.id;

    if (!key) {
      return res
        .status(400)
        .json({ error: 'S3 object key is required in the request body' });
    }

    // Generate a pre-signed URL for the audio file
    const url = await generatePresignedUrl(key);
    const audioBlob = await fetch(url).then((r) => r.blob());
    const openAI = new OpenAIService();
    const transcription = await openAI.transcribeAudio(audioBlob);

    // Create an object that adheres to the interface structure
    const args: updateTranscriptionArgs = {
      id: noteID,
      input: {
        transcription: JSON.stringify(transcription),
      },
    };
    // update note entry with transcription using graphQL
    const note = await NoteMutations.updateTranscription(args);
    // return the note object
    res.json({ success: true, note: note });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
});

export default router;
