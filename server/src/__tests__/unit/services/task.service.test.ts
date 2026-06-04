import * as TaskService from '../../../services/task.service'
import * as TaskRepository from '../../../repositories/task.repository'
import { NotFoundError } from '../../../utils/errors'

jest.mock('../../../repositories/task.repository')

const mockTask = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllTasks', () => {
    it('should return paginated tasks', async () => {
      const mockResponse = {
        data: [mockTask],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      }
      jest.spyOn(TaskRepository, 'findAll').mockResolvedValue(mockResponse)

      const result = await TaskService.getAllTasks({ page: 1, limit: 10 })

      expect(TaskRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getTaskById', () => {
    it('should return a task when found', async () => {
      jest.spyOn(TaskRepository, 'findById').mockResolvedValue(mockTask)

      const result = await TaskService.getTaskById(mockTask.id)

      expect(TaskRepository.findById).toHaveBeenCalledWith(mockTask.id)
      expect(result).toEqual(mockTask)
    })

    it('should throw NotFoundError when task does not exist', async () => {
      jest.spyOn(TaskRepository, 'findById').mockResolvedValue(null)

      await expect(TaskService.getTaskById('non-existent-id'))
        .rejects
        .toThrow(NotFoundError)
    })
  })

  describe('createTask', () => {
    it('should create and return a task', async () => {
      jest.spyOn(TaskRepository, 'create').mockResolvedValue(mockTask)

      const dto = { title: 'Test Task', description: 'Test Description' }
      const result = await TaskService.createTask(dto)

      expect(TaskRepository.create).toHaveBeenCalledWith(dto)
      expect(result).toEqual(mockTask)
    })
  })

  describe('updateTask', () => {
    it('should update and return the task', async () => {
      const updated = { ...mockTask, title: 'Updated Title' }
      jest.spyOn(TaskRepository, 'update').mockResolvedValue(updated)

      const result = await TaskService.updateTask(mockTask.id, { title: 'Updated Title' })

      expect(result).toEqual(updated)
    })

    it('should throw NotFoundError when task does not exist', async () => {
      jest.spyOn(TaskRepository, 'update').mockResolvedValue(null)

      await expect(TaskService.updateTask('non-existent-id', { title: 'x' }))
        .rejects
        .toThrow(NotFoundError)
    })
  })

  describe('deleteTask', () => {
    it('should delete the task successfully', async () => {
      jest.spyOn(TaskRepository, 'remove').mockResolvedValue(true)

      await expect(TaskService.deleteTask(mockTask.id)).resolves.not.toThrow()
    })

    it('should throw NotFoundError when task does not exist', async () => {
      jest.spyOn(TaskRepository, 'remove').mockResolvedValue(false)

      await expect(TaskService.deleteTask('non-existent-id'))
        .rejects
        .toThrow(NotFoundError)
    })
  })
})