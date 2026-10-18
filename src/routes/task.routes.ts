import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getTaskActivities,
  assignTask
} from '../controllers/task.controller';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import {
  createTaskSchema,
  updateTaskSchema,
  getTaskByIdSchema,
  addCommentSchema,
  assignTaskSchema
} from '../schemas/task.schema';

const router = Router();

router.use(requireAuth);

router.get('/', getTasks);
router.get('/:id', validateRequest(getTaskByIdSchema), getTaskById);
router.post('/', validateRequest(createTaskSchema), createTask);
router.patch('/:id', validateRequest(updateTaskSchema), updateTask);
router.delete('/:id', validateRequest(getTaskByIdSchema), deleteTask);

// New task collaboration routes
router.post('/:id/comments', validateRequest(addCommentSchema), addComment);
router.get('/:id/activity', validateRequest(getTaskByIdSchema), getTaskActivities);
router.post('/:id/assign', validateRequest(assignTaskSchema), assignTask);

export default router;
