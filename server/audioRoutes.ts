import express from 'express';
import multer from 'multer';
import { uploadAudioToS3 } from '../app/services/AWSService';

const router = express.Router();

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

router.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res
      .status(400)
      .json({ success: false, message: 'No file uploaded.' });
  }

  try {
    const audioBuffer = req.file.buffer; // Access the file buffer here
    const url = await uploadAudioToS3(audioBuffer);
    res.json({ success: true, url });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    res.status(500).json({ success: false, message: 'Failed to upload.' });
  }
});

export default router;
