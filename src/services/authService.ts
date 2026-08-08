import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { userRepo, Role, User } from '../repositories/store';

const secret = process.env.JWT_SECRET || 'eventful-secret';

export const authService = {
  register: (email: string, password: string, role: Role) => {
    return userRepo.create(email, password, role);
  },
  login: (email: string, password: string) => {
    const user = userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const valid = bcrypt.compareSync(password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
    return { user, token };
  },
};
