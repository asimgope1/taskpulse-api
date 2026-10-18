import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import {
  createTaskSchema,
  updateTaskSchema,
  getTaskByIdSchema,
  getTasksQuerySchema
} from '../schemas/task.schema';

const router = Router();

router.use(requireAuth);

router.get('/', validateRequest(getTasksQuerySchema), getTasks);
router.get('/:id', validateRequest(getTaskByIdSchema), getTaskById);
router.post('/', validateRequest(createTaskSchema), createTask);
router.patch('/:id', validateRequest(updateTaskSchema), updateTask);
router.delete('/:id', validateRequest(getTaskByIdSchema), deleteTask);

export default router;
