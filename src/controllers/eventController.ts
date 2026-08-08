import { Request, Response } from 'express';
import { eventService } from '../services/eventService';
import { AuthedRequest } from '../middleware/auth';

export const eventController = {
  createEvent: (req: AuthedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { title, description, location, startsAt, endsAt, priceCents, reminderOptions } = req.body;
    if (!title || !description || !location || !startsAt || !endsAt || priceCents == null) {
      return res.status(400).json({ message: 'Missing required event fields' });
    }
    const event = eventService.createEvent(user.id, {
      title,
      description,
      location,
      startsAt,
      endsAt,
      priceCents,
      reminderOptions: reminderOptions || [],
    });
    return res.status(201).json(event);
  },
  listAll: (_req: Request, res: Response) => {
    return res.json(eventService.listEvents());
  },
  listCreatorEvents: (req: AuthedRequest, res: Response) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Authentication required' });
    return res.json(eventService.listCreatorEvents(user.id));
  },
  getEvent: (req: Request, res: Response) => {
    const event = eventService.getEvent(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    return res.json(event);
  },
};
