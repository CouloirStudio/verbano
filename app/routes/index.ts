import { Router } from 'express';
import audioRoutes from './audioRoutes';
import transcriptionRoutes from './transcriptionRoutes';

/**
 * Router for all API endpoints.
 */
const router = Router();
router.use('/audio', audioRoutes);
router.use('/transcription', transcriptionRoutes);

export default router;
