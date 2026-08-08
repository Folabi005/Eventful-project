import { Router } from 'express';
import authRoutes from './authRoutes';
import eventRoutes from './eventRoutes';
import ticketRoutes from './ticketRoutes';
import analyticsRoutes from './analyticsRoutes';
import reminderRoutes from './reminderRoutes';
import paymentRoutes from './paymentRoutes';
import applicantRoutes from './applicantRoutes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/tickets', ticketRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reminders', reminderRoutes);
router.use('/payments', paymentRoutes);
router.use('/applicants', applicantRoutes);

router.get('/', (_req, res) => res.json({ ok: true, service: 'Eventful API' }));
export default router;
