import { Router } from 'express';
import audioRoutes from './audioRoutes';
import transcriptionRoutes from './transcriptionRoutes';
import summaryRoutes from '@/app/routes/summaryRoutes';
import activateRoutes from '@/app/routes/activateRoutes';
import transferRoutes from '@/app/routes/transferRoutes';

/**
 * Router for all API endpoints.
 */
const router = Router();
router.use('/audio', audioRoutes);
router.use('/transcription', transcriptionRoutes);
router.use('/summaries', summaryRoutes);
router.use('/activate', activateRoutes);
router.use('/transfer', transferRoutes);

export default router;
