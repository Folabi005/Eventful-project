import { Request, Response } from 'express';
import { reminderService } from '../services/reminderService';
import { AuthedRequest } from '../middleware/auth';

export const reminderController = {
  createReminder: (req: AuthedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { eventId, remindAt } = req.body;
    if (!eventId || !remindAt) {
      return res.status(400).json({ message: 'eventId and remindAt are required' });
    }
    const reminder = reminderService.createReminder(user.id, eventId, remindAt);
    return res.status(201).json(reminder);
  },
  listUserReminders: (req: AuthedRequest, res: Response) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Authentication required' });
    return res.json(reminderService.listUserReminders(user.id));
  },
  listReminderOptions: (_req: Request, res: Response) => {
    return res.json(reminderService.defaultOptions());
  },
};
