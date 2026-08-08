import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';
import { paymentRepo, eventRepo } from '../repositories/store';
import { AuthedRequest } from '../middleware/auth';

export const paymentController = {
  initialize: async (req: AuthedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { eventId, amountCents } = req.body;
    if (!eventId || amountCents == null) {
      return res.status(400).json({ message: 'eventId and amountCents are required' });
    }

    const event = eventRepo.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.priceCents !== amountCents) {
      return res.status(400).json({ message: 'Payment amount must match event ticket price' });
    }

    try {
      const paymentData = await paymentService.initializePayment(user.email, amountCents);
      const payment = paymentRepo.create(eventId, user.id, amountCents, (paymentData as any).reference);
      return res.status(201).json({ payment, paymentData });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
  verify: async (req: Request, res: Response) => {
    const { reference } = req.query as { reference?: string };
    if (!reference) {
      return res.status(400).json({ message: 'reference is required' });
    }
    try {
      const verification = await paymentService.verifyPayment(reference);
      const payment = paymentRepo.updateStatus(reference, verification.status ? 'completed' : 'failed');
      if (!payment) {
        return res.status(404).json({ message: 'Payment record not found' });
      }
      return res.json({ payment, verification });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
};
