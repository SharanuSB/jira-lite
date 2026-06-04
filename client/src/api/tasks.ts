import axios from 'axios'
import type { Task, CreateTaskDto, UpdateTaskDto, TaskFilters, PaginatedResponse } from '../types/task.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export const getTasks = (filters: TaskFilters) => {
  return api.get<PaginatedResponse<Task>>('/tasks', { params: filters })
}

export const getTaskById = (id: string) => {
  return api.get<Task>(`/tasks/${id}`)
}

export const createTask = (dto: CreateTaskDto) => {
  return api.post<Task>('/tasks', dto)
}

export const updateTask = (id: string, dto: UpdateTaskDto) => {
  return api.put<Task>(`/tasks/${id}`, dto)
}

export const deleteTask = (id: string) => {
  return api.delete(`/tasks/${id}`)
}