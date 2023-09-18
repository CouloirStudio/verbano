import express from 'express';
import multer from 'multer';
import { uploadAudioToS3 } from '../app/services/AWSService';

const router = express.Router();

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

import { Note } from '../app/models/Note';
import { Project } from '../app/models/Project';

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
    console.error('Error uploading to S3 or saving to MongoDB:', error);
    res.status(500).json({ success: false, message: 'Failed to upload.' });
  }
});

export default router;
