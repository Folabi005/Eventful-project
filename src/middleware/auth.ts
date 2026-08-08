import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userRepo, User } from '../repositories/store';

export interface AuthedRequest extends Request {
  user?: User;
}

const secret = process.env.JWT_SECRET || 'eventful-secret';

export function authenticate(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, secret) as { userId: string };
    const user = userRepo.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function authorizeRole(role: 'creator' | 'eventee') {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}
