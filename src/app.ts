import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './utils/errors';

export const createApp = (): Express => {
  const app = express();

  // Core Middlewares
  app.use(cors());
  app.use(express.json());

  // Mount API Routes
  app.use('/health', healthRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/tasks', taskRoutes);

  // 404 Handler
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError('API Route'));
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
