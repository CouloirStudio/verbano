import {Router} from 'express';
import audioRoutes from './audioRoutes';
import transcriptionRoutes from './transcriptionRoutes';
import summaryRoutes from '@/app/routes/summaryRoutes';

/**
 * Router for all API endpoints.
 */
const router = Router();
router.use('/audio', audioRoutes);
router.use('/transcription', transcriptionRoutes);
router.use('/summaries', summaryRoutes);

export default router;
