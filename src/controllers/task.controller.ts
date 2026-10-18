import { Request, Response, NextFunction } from 'express';
import { store } from '../db/store';
import { NotFoundError, UnauthorizedError } from '../utils/errors';
import { TaskStatus, TaskPriority } from '../types';

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 10));

    let tasks = await store.getAllTasks();

    if (status) {
      tasks = tasks.filter(t => t.status === (status as TaskStatus));
    }

    if (priority) {
      tasks = tasks.filter(t => t.priority === (priority as TaskPriority));
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort tasks
    tasks.sort((a, b) => {
      let valA: string | number = a.createdAt;
      let valB: string | number = b.createdAt;

      if (sortBy === 'dueDate') {
        valA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        valB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      } else if (sortBy === 'priority') {
        const priorityRank = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
        valA = priorityRank[a.priority] || 0;
        valB = priorityRank[b.priority] || 0;
      } else {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (valA === valB) return 0;
      const comparison = valA > valB ? 1 : -1;
      return order === 'asc' ? comparison : -comparison;
    });

    const total = tasks.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedTasks = tasks.slice(startIndex, startIndex + limit);

    res.status(200).json({
      success: true,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      data: paginatedTasks
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const task = await store.findTaskById(id);

    if (!task) {
      throw new NotFoundError('Task');
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { title, description, status, priority, assigneeId, tags, dueDate } = req.body;

    const task = await store.createTask({
      title,
      description,
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      creatorId: req.user.userId,
      assigneeId,
      tags: tags || [],
      dueDate
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await store.findTaskById(id);

    if (!existing) {
      throw new NotFoundError('Task');
    }

    const updated = await store.updateTask(id, req.body);

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await store.findTaskById(id);

    if (!existing) {
      throw new NotFoundError('Task');
    }

    await store.deleteTask(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
