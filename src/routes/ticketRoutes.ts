import { Router } from 'express';
import { ticketController } from '../controllers/ticketController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();
router.post('/purchase', authenticate, authorizeRole('eventee'), ticketController.purchase);
router.get('/me', authenticate, authorizeRole('eventee'), ticketController.listUserTickets);
router.post('/:ticketId/scan', ticketController.scanTicket);
export default router;
