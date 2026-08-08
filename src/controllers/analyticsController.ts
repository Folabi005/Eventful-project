import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { AuthedRequest } from '../middleware/auth';

export const analyticsController = {
  eventStats: (req: AuthedRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    try {
      return res.json(analyticsService.eventStats(req.params.eventId));
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  },
  creatorStats: (req: AuthedRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    return res.json(analyticsService.creatorStats(req.user.id));
  },
};
