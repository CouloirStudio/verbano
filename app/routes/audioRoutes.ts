import express from 'express';
import multer from 'multer';
import { uploadAudioToS3, deleteAudioFromS3 } from '../services/AWSService';
import { Note } from '../models/Note';
import { Project } from '../models/Project';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const PROJECT_NAME = 'TestProject';
const FAILED_TO_UPLOAD_MESSAGE = 'Failed to upload.';

router.post('/audio/upload', upload.single('audio'), async (req, res) => {
  try {
    validateRequest(req);

    const audioBuffer = req.file.buffer;
    const url = await handleAudioUpload(audioBuffer);

    const noteId = await saveNote(url);
    res.json({ success: true, noteId, url });
  } catch (error) {
    handleError(error, res);
  }
});

function validateRequest(req) {
  if (!req.file || !req.file.buffer) {
    throw new Error('No file uploaded.');
  }
}

async function handleAudioUpload(audioBuffer: Buffer): Promise<string> {
  const url = await uploadAudioToS3(audioBuffer);
  const testProject = await Project.findOne({ projectName: PROJECT_NAME });

  if (!testProject) {
    await deleteAudioFromS3(url);
    throw new Error('TestProject not found');
  }
  return url;
}

async function saveNote(url: string): Promise<string> {
  const testProject = await Project.findOne({ projectName: PROJECT_NAME });
  const note = new Note({
    audioLocation: url,
    projectId: testProject._id,
    noteName: new Date().toISOString(),
  });
  await note.save();
  return note._id;
}

function handleError(error, res) {
  if (error.message.includes('Failed to upload audio to S3')) {
    return res.status(500).json({
      success: false,
      message: 'Failed to upload audio to S3. Please check AWS configurations.',
    });
  }
  res.status(500).json({ success: false, message: FAILED_TO_UPLOAD_MESSAGE });
}

export default router;
