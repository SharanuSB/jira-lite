import { Router } from 'express';
import * as TaskController from '../controllers/task.controller';
import { validate } from '../middlewares/validate';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../validators/task.validator';

const router = Router();

router.get('/', validate(taskQuerySchema, 'query'), TaskController.getAll);
router.get('/:id', validate(taskQuerySchema, 'query'), TaskController.getOne);
router.post('/', validate(createTaskSchema), TaskController.create);
router.put('/:id', validate(updateTaskSchema), TaskController.update);
router.delete('/:id', TaskController.remove);

export default router;