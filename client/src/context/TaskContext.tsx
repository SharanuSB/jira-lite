import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import toast from 'react-hot-toast'
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
  retryFetch: () => void
}

const TaskContext = createContext<TaskContextType | null>(null)

const withRetry = async <T,>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> => {
  try {
    return await fn()
  } catch (err) {
    if (retries === 0) throw err
    await new Promise(r => setTimeout(r, delay))
    return withRetry(fn, retries - 1, delay * 2)
  }
}

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
      const response = await withRetry(() => TaskApi.getTasks({
        status: filters.status,
        page: filters.page,
        limit: filters.limit,
        search: debouncedSearch,
      }))
      const data: PaginatedResponse<Task> = response.data
      setTasks(data.data)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      const msg = 'Unable to reach the server. Please check your connection.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [filters.status, filters.page, filters.limit, debouncedSearch])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const setFilters = (newFilters: Partial<TaskFilters>) => {
    const isPageChange = 'page' in newFilters
    setFiltersState(prev => ({ ...prev, ...newFilters, ...(isPageChange ? {} : { page: 1 }) }))
  }

  const createTask = async (dto: CreateTaskDto) => {
    await TaskApi.createTask(dto)
    await fetchTasks()
    toast.success('Task created')
  }

  const updateTask = async (id: string, dto: UpdateTaskDto) => {
    await TaskApi.updateTask(id, dto)
    await fetchTasks()
    toast.success('Task updated')
  }

  const deleteTask = async (id: string) => {
    await TaskApi.deleteTask(id)
    await fetchTasks()
    toast.success('Task deleted')
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
      retryFetch: fetchTasks,
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
