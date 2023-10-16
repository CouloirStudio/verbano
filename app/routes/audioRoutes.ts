import express from 'express';
import multer from 'multer';
import { generatePresignedUrl, uploadAudioToS3 } from '../services/AWSService';
import { Note } from '../models/Note';
import { Project } from '../models/Project';

const router = express.Router();

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

/**
 * Endpoint to upload audio files.
 */
router.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res
      .status(400)
      .json({ success: false, message: 'No file uploaded.' });
  }

  try {
    const audioBuffer = req.file.buffer;
    const url = await uploadAudioToS3(audioBuffer);

    // Get the TestProject ID
    const testProject = await Project.findOne({ projectName: 'TestProject' });

    if (!testProject) {
      throw new Error('TestProject not found');
    }

    // Create a new Note entry with the URL and associate with TestProject
    const note = new Note({
      audioLocation: url,
      projectId: testProject._id,
      noteName: new Date().toISOString(), // Using date as note name for now.
    });

    await note.save();

    // Add note ID to the notes array of the project
    testProject.notes.push(note._id);
    await testProject.save();

    res.json({ success: true, noteId: note._id, url });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in /upload route:', error.message);

      if (error.message.includes('Failed to upload audio to S3')) {
        return res.status(500).json({
          success: false,
          message:
            'Failed to upload audio to S3. Please check AWS configurations.',
        });
      }
    } else {
      console.error('An unexpected error occurred:', error);
    }

    res.status(500).json({ success: false, message: 'Failed to upload.' });
  }
});

/**
 * Endpoint to retrieve audio files using a provided S3 object key.
 */
router.post('/retrieve', async (req, res) => {
  try {
    // Parse the incoming JSON data from the request body
    const { key } = req.body;
    if (!key) {
      return res
        .status(400)
        .json({ error: 'S3 object key is required in the request body' });
    }

    // Generate a pre-signed URL for the audio file
    const url = await generatePresignedUrl(key);

    res.json({ success: true, url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
