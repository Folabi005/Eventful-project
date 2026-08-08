import { Router } from 'express';
import { applicantController } from '../controllers/applicantController';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();
router.get('/creator', authenticate, authorizeRole('creator'), applicantController.listApplicants);
export default router;
