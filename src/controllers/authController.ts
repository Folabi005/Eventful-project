import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const authController = {
  register: (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'email, password, and role are required' });
    }
    try {
      const user = authService.register(email, password, role);
      const { token } = authService.login(email, password);
      return res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
  login: (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    try {
      const result = authService.login(email, password);
      return res.json({ user: { id: result.user.id, email: result.user.email, role: result.user.role }, token: result.token });
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  },
};
