import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED']).default('TODO'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
    assigneeId: z.string().optional(),
    tags: z.array(z.string()).default([]),
    dueDate: z.string().datetime().optional()
  })
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Task ID is required')
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    assigneeId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    dueDate: z.string().datetime().optional()
  })
});

export const getTaskByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Task ID is required')
  })
});
