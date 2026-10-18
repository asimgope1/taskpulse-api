import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';
import { AuthPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization header missing or invalid format (Bearer token required)');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    throw new UnauthorizedError('Token is invalid or expired');
  }
};
