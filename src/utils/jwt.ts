import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-taskpulse-dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const signToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
};
