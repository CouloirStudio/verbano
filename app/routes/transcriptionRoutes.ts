import express from 'express';
import { generatePresignedUrl } from '../services/AWSService';
import OpenAIService from '@/app/services/OpenAIService';
import { NoteMutations } from '../resolvers/NoteResolvers';
import { updateTranscriptionArgs } from '../resolvers/types';

const router = express.Router();

/**
 * Endpoint to transcribe audio
 */
router.post('/transcribe', async (req, res) => {
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
    return await NoteMutations.updateTranscription(args);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /upload route:', error.message);

      if (error.message.includes('Failed to get audio to S3')) {
        return res.status(500).json({
          success: false,
          message:
            'Failed to get audio from S3. Please check AWS configurations.',
        });
      }
    } else {
      console.error('An unexpected error occurred:', error);
    }

    res.status(500).json({ success: false, message: 'Failed to upload.' });
  }
});

export default router;
