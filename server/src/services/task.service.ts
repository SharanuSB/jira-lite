import * as TaskRepository from '../repositories/task.repository';
import { CreateTaskDto, UpdateTaskDto, TaskFilters } from '../types/task.types';
import { NotFoundError } from '../utils/errors';

export const getAllTasks = (filters: TaskFilters) => {
  return TaskRepository.findAll(filters);
};

export const getTaskById = async (id: string) => {
  const task = await TaskRepository.findById(id);
  if (!task) throw new NotFoundError('Task not found');
  return task;
};

export const createTask = (dto: CreateTaskDto) => {
  return TaskRepository.create(dto);
};

export const updateTask = async (id: string, dto: UpdateTaskDto) => {
  const task = await TaskRepository.update(id, dto);
  if (!task) throw new NotFoundError('Task not found');
  return task;
};

export const deleteTask = async (id: string) => {
  const deleted = await TaskRepository.remove(id);
  if (!deleted) throw new NotFoundError('Task not found');
};
