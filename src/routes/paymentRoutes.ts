import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.post('/initialize', authenticate, paymentController.initialize);
router.get('/verify', paymentController.verify);
export default router;
