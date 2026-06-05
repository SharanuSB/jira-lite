import { createContext, useContext, useState, type ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
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

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()

  const [filters, setFiltersState] = useState<TaskFilters>({
    page: 1,
    limit: 10,
  })

  const debouncedSearch = useDebounce(filters.search, 400)

  const queryKey = ['tasks', filters.status, filters.page, filters.limit, debouncedSearch]

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => TaskApi.getTasks({
      status: filters.status,
      page: filters.page,
      limit: filters.limit,
      search: debouncedSearch,
    }).then(r => r.data),
    staleTime: 30000,
    retry: 2,
    placeholderData: keepPreviousData,
  })

  if (error) toast.error('Unable to reach the server. Please check your connection.')

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks'] })

  const createMutation = useMutation({
    mutationFn: (dto: CreateTaskDto) => TaskApi.createTask(dto),
    onSuccess: () => { invalidate(); toast.success('Task created') },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTaskDto }) => TaskApi.updateTask(id, dto),
    onSuccess: () => { invalidate(); toast.success('Task updated') },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => TaskApi.deleteTask(id),
    onSuccess: () => { invalidate(); toast.success('Task deleted') },
  })

  const setFilters = (newFilters: Partial<TaskFilters>) => {
    const isPageChange = 'page' in newFilters
    setFiltersState(prev => ({ ...prev, ...newFilters, ...(isPageChange ? {} : { page: 1 }) }))
  }

  const paginatedData = data as PaginatedResponse<Task> | undefined

  return (
    <TaskContext.Provider value={{
      tasks: paginatedData?.data ?? [],
      loading: isLoading,
      error: error ? 'Unable to reach the server. Please check your connection.' : null,
      total: paginatedData?.total ?? 0,
      page: filters.page ?? 1,
      totalPages: paginatedData?.totalPages ?? 0,
      filters,
      setFilters,
      createTask: async (dto) => { await createMutation.mutateAsync(dto) },
      updateTask: async (id, dto) => { await updateMutation.mutateAsync({ id, dto }) },
      deleteTask: async (id) => { await deleteMutation.mutateAsync(id) },
      retryFetch: refetch,
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
