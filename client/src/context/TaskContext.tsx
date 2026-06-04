import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Task, TaskFilters, CreateTaskDto, UpdateTaskDto, PaginatedResponse } from '../types/task.types'
import * as TaskApi from '../api/tasks'
import { useDebounce } from '../hooks/useDebounce'

interface TaskContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  total: number
  page: number
  totalPages: number
  filters: TaskFilters
  setFilters: (filters: Partial<TaskFilters>) => void
  createTask: (dto: CreateTaskDto) => Promise<void>
  updateTask: (id: string, dto: UpdateTaskDto) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

const TaskContext = createContext<TaskContextType | null>(null)

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFiltersState] = useState<TaskFilters>({
    page: 1,
    limit: 10,
  })

  const debouncedSearch = useDebounce(filters.search, 400)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await TaskApi.getTasks({
        ...filters,
        search: debouncedSearch,
      })
      const data: PaginatedResponse<Task> = response.data
      setTasks(data.data)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [filters, debouncedSearch])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const setFilters = (newFilters: Partial<TaskFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const createTask = async (dto: CreateTaskDto) => {
    try {
      await TaskApi.createTask(dto)
      await fetchTasks()
    } catch (err) {
      throw new Error('Failed to create task')
    }
  }

  const updateTask = async (id: string, dto: UpdateTaskDto) => {
    try {
      await TaskApi.updateTask(id, dto)
      await fetchTasks()
    } catch (err) {
      throw new Error('Failed to update task')
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await TaskApi.deleteTask(id)
      await fetchTasks()
    } catch (err) {
      throw new Error('Failed to delete task')
    }
  }

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      total,
      page: filters.page || 1,
      totalPages,
      filters,
      setFilters,
      createTask,
      updateTask,
      deleteTask,
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTaskContext must be used inside TaskProvider')
  return context
}