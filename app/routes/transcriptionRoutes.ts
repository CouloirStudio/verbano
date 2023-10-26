import express from 'express';
import { generatePresignedUrl } from '../services/AWSService';
import OpenAIService from '../services/OpenAIService';
import { Note } from '../models';

const router = express.Router();

/**
 * Endpoint to transcribe audio
 */
router.post('/transcribe', async (req, res) => {
  try {
    const data = req.body;
    const key = data.key;
    const noteID = data.id;
    console.log(noteID);

    if (!key) {
      return res
        .status(400)
        .json({ error: 'S3 object key is required in the request body' });
    }

    // Generate a pre-signed URL for the audio file
    const url = await generatePresignedUrl(key);
    // Get audio from AWSS3 bucket using signed URL
    const audioBlob = await fetch(url).then((r) => r.blob());
    const openAI = new OpenAIService();
    // Transcribe audio
    const transcription = await openAI.transcribeAudio(audioBlob);

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
