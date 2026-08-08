import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();
router.get('/', eventController.listAll);
router.get('/creator/me', authenticate, authorizeRole('creator'), eventController.listCreatorEvents);
router.get('/:eventId', eventController.getEvent);
router.post('/', authenticate, authorizeRole('creator'), eventController.createEvent);
export default router;
