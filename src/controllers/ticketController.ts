import { Request, Response } from 'express';
import { ticketService } from '../services/ticketService';
import { AuthedRequest } from '../middleware/auth';

export const ticketController = {
  purchase: async (req: AuthedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { eventId, paymentReference } = req.body;
    if (!eventId || !paymentReference) {
      return res.status(400).json({ message: 'eventId and paymentReference are required' });
    }
    try {
      const ticket = await ticketService.purchaseTicket(eventId, user.id, paymentReference);
      return res.status(201).json(ticket);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
  listUserTickets: (req: AuthedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    return res.json(ticketService.listUserTickets(user.id));
  },
  scanTicket: (req: Request, res: Response) => {
    const ticket = ticketService.scanTicket(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    return res.json(ticket);
  },
};
