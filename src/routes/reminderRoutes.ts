import { Router } from 'express';
import { reminderController } from '../controllers/reminderController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.get('/options', reminderController.listReminderOptions);
router.post('/', authenticate, reminderController.createReminder);
router.get('/me', authenticate, reminderController.listUserReminders);
export default router;
