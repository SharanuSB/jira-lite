import { Request, Response } from 'express';
import * as TaskService from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto, TaskFilters } from '../types/task.types';

type IdParam = { id: string };

export const getAll = async (req: Request<{}, {}, {}, TaskFilters>, res: Response) => {
  const tasks = await TaskService.getAllTasks(req.query);
  res.json(tasks);
};

export const getOne = async (req: Request<IdParam>, res: Response) => {
  const task = await TaskService.getTaskById(req.params.id);
  res.json(task);
};

export const create = async (req: Request<{}, {}, CreateTaskDto>, res: Response) => {
  const task = await TaskService.createTask(req.body);
  res.status(201).json(task);
};

export const update = async (req: Request<IdParam, {}, UpdateTaskDto>, res: Response) => {
  const task = await TaskService.updateTask(req.params.id, req.body);
  res.json(task);
};

export const remove = async (req: Request<IdParam>, res: Response) => {
  await TaskService.deleteTask(req.params.id);
  res.status(204).send();
};
