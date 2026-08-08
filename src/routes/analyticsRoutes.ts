import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.get('/creator', authenticate, analyticsController.creatorStats);
router.get('/event/:eventId', authenticate, analyticsController.eventStats);
export default router;
