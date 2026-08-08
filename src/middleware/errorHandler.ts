import { Request, Response, NextFunction } from 'express';

export default function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const payload = {
    message: err.message || 'Internal server error',
    errors: err.errors || undefined,
  };
  res.status(status).json(payload);
}
