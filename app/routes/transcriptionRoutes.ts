import express from 'express';
import { generatePresignedUrl } from '../services/AWSService';
import { Note } from '../models';
import ReplicateService from '@/app/services/ReplicateService';

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
    const replicateService = new ReplicateService();
    // Transcribe audio using the ReplicateService
    const transcription = await replicateService.transcribeAudio(url);

    // Get and update note with transcription
    const note = await Note.findById(noteID);
    if (!note) {
      // throw some error
      throw new Error('Note doesnt exist');
    }
    note.transcription = JSON.stringify(transcription);
    note.save();
    // return the transcription
    res.json({ success: true, transcription: transcription });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
});

export default router;
