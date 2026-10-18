import { Request, Response, NextFunction } from 'express';
import { store } from '../db/store';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../utils/errors';
import { TaskStatus, TaskPriority } from '../types';

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, priority, search } = req.query;

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

    res.status(200).json({
      success: true,
      meta: {
        total: tasks.length
      },
      data: tasks
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

export const addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const id = req.params.id as string;
    const task = await store.findTaskById(id);

    if (!task) {
      throw new NotFoundError('Task');
    }

    const { content } = req.body;
    const comment = await store.addComment(id, req.user.userId, content);

    // Record activity audit entry
    await store.logActivity(id, req.user.userId, 'COMMENT_ADDED', `User added a new comment`);

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskActivities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const task = await store.findTaskById(id);

    if (!task) {
      throw new NotFoundError('Task');
    }

    const activities = await store.getActivities(id);
    const comments = await store.getComments(id);

    res.status(200).json({
      success: true,
      data: {
        taskId: id,
        activities,
        comments
      }
    });
  } catch (error) {
    next(error);
  }
};

export const assignTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const id = req.params.id as string;
    const { assigneeId } = req.body;

    const task = await store.findTaskById(id);
    if (!task) {
      throw new NotFoundError('Task');
    }

    const assignee = await store.findUserById(assigneeId);
    if (!assignee) {
      throw new BadRequestError(`Assignee user with ID ${assigneeId} does not exist`);
    }

    const updatedTask = await store.updateTask(id, { assigneeId });

    await store.logActivity(
      id,
      req.user.userId,
      'ASSIGNED',
      `Task assigned to ${assignee.name} (${assignee.email})`
    );

    res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};
