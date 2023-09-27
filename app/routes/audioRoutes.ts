import express from 'express';
import multer from 'multer';
import { uploadAudioToS3 } from '../services/AWSService';

const router = express.Router();

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

import { Note } from '../models/Note';
import { Project } from '../models/Project';

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

export default router;
