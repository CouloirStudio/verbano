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

    const handleProgressUpdate = async (
      progress: number,
      estimatedSecondsLeft?: number,
    ) => {
      try {
        const note = await Note.findById(noteID);
        if (!note) {
          throw new Error('Note does not exist');
        }

        if (!note.progress) {
          note.progress = { percentage: 0, secondsLeft: 0 };
        }

        note.progress.percentage = progress;
        if (estimatedSecondsLeft) {
          note.progress.secondsLeft = estimatedSecondsLeft;
        }

        await note.save();
      } catch (error) {
        console.error('Error updating note progress:', error);
      }
    };

    if (!key) {
      return res
        .status(400)
        .json({ error: 'S3 object key is required in the request body' });
    }

    const note = await Note.findById(noteID);
    if (!note) {
      throw new Error('Note doesnt exist');
    }

    note.progress = { percentage: 0, secondsLeft: 0 };

    // Generate a pre-signed URL for the audio file
    const url = await generatePresignedUrl(key);
    const replicateService = new ReplicateService();
    // Transcribe audio using the ReplicateService
    const transcription = await replicateService
      .transcribeAudio(url, handleProgressUpdate)
      .then(async (transcription) => {
        // Get and update note with transcription
        const note = await Note.findById(noteID);
        if (!note) {
          // throw some error
          throw new Error('Note doesnt exist');
        }
        note.transcription = transcription;
        note.progress = { percentage: 1, secondsLeft: 0 };
        note.save();
        // return the transcription
        res.json({ success: true, transcription: transcription });
      })
      .catch((error) => {
        console.error('An unexpected error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/progress/:noteId', async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const progress = note.progress?.percentage || 0;
    const secondsLeft = note.progress?.secondsLeft || 0;

    res.json({
      isComplete: progress >= 1,
      progress,
      estimatedSecondsLeft: secondsLeft,
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
