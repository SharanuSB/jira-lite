import { Router } from 'express';
import * as TaskController from '../controllers/task.controller';
import { validate } from '../middlewares/validate';
import { createTaskSchema, updateTaskSchema, taskQuerySchema, uuidParamSchema } from '../validators/task.validator';

const router = Router();

router.get('/', validate(taskQuerySchema, 'query'), TaskController.getAll);
router.get('/:id', validate(uuidParamSchema, 'params'), validate(taskQuerySchema, 'query'), TaskController.getOne);
router.post('/', validate(createTaskSchema), TaskController.create);
router.put('/:id', validate(uuidParamSchema, 'params'), validate(updateTaskSchema), TaskController.update);
router.delete('/:id', validate(uuidParamSchema, 'params'), TaskController.remove);

export default router;