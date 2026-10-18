import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { store } from '../db/store';
import { signToken } from '../utils/jwt';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../utils/errors';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await store.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await store.createUser({
      name,
      email,
      passwordHash,
      role: role || 'MEMBER'
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const { passwordHash: _, ...safeUser } = user;

    res.status(201).json({
      success: true,
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await store.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const { passwordHash: _, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = await store.findUserById(req.user.userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const { passwordHash: _, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: {
        user: safeUser
      }
    });
  } catch (error) {
    next(error);
  }
};
