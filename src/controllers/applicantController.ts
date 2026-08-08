import { Request, Response } from 'express';
import { applicantService } from '../services/applicantService';
import { AuthedRequest } from '../middleware/auth';

export const applicantController = {
  listApplicants: (req: AuthedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    return res.json(applicantService.listApplicantsForCreator(user.id));
  },
};
