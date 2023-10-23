import express from 'express';
import { generatePresignedUrl } from '../services/AWSService';
import OpenAIService from '../services/OpenAIService';
import { Note } from '../models';

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
    console.log(noteID);

    if (!key) {
      return res
        .status(400)
        .json({ error: 'S3 object key is required in the request body' });
    }

    // Generate a pre-signed URL for the audio file
    const url = await generatePresignedUrl(key);
    await fetch(url).then((r) => console.log(r));
    const audioBlob = await fetch(url).then((r) => r.blob());
    const openAI = new OpenAIService();
    const note = await Note.findById(noteID);

    if (!note) {
      // throw some error
      throw new Error('Note doesnt exist');
    }
    const transcription = await openAI.transcribeAudio(audioBlob);
    console.log('transcription', transcription);
    // save that shit
    note.transcription = JSON.stringify(transcription);
    note.save();

    // return the note object
    console.log('setting response in transcription routes');
    res.json({ success: true, transcription: transcription });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
});

export default router;
