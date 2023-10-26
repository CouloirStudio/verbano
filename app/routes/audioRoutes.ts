import express from 'express';
import multer from 'multer';
import { generatePresignedUrl, uploadAudioToS3 } from '../services/AWSService';
import { INote, Note } from '../models/Note';
import { IProject, Project } from '../models/Project';

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
    const key = await uploadAudioToS3(audioBuffer);

    let note: INote | null = null;
    let project: IProject | null = null;

    if (req.body.noteId) {
      note = await Note.findById(req.body.noteId);
      if (note) {
        project = await Project.findOne({ 'notes.note': note._id });
        note.audioLocation = key;
        await note.save();
      }
    }

    // Check if projectId in request body
    if (!project && req.body.projectId) {
      project = await Project.findById(req.body.projectId);
    }

    if (!project) {
      project = new Project({
        projectName: 'New Project',
      });
      await project.save();
    }

    if (!project) {
      throw new Error('Project not found.');
    }

    if (!note) {
      // Create a new Note entry with the URL and associate with TestProject
      note = new Note({
        audioLocation: key,
        projectId: project._id,
        noteName: new Date().toISOString(), // Using date as note name for now.
      });
      await note.save();

      // Add note ID to the notes array of the project
      project.notes.push({ note: note._id, position: project.notes.length });
      await project.save();
    }

    res.json({ success: true, noteId: note._id, key });
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
    const data = req.body;
    const key = data.key;

    if (!key) {
      return res
        .status(400)
        .json({ error: 'S3 object key is required in the request body' });
    }

    // Generate a pre-signed URL for the audio file
    const url = await generatePresignedUrl(key);

    res.json({ success: true, signedURL: url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;
