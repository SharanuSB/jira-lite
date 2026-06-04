import request from 'supertest'
import app from '../../app'
import * as TaskService from '../../services/task.service'
import { NotFoundError } from '../../utils/errors'

jest.mock('../../services/task.service')

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000'
const OTHER_UUID = '999e4567-e89b-12d3-a456-426614174999'

const mockTask = {
  id: VALID_UUID,
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockPaginated = {
  data: [mockTask],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
}

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/tasks', () => {
    it('should return paginated tasks with 200', async () => {
      jest.spyOn(TaskService, 'getAllTasks').mockResolvedValue(mockPaginated)

      const res = await request(app).get('/api/tasks')

      expect(res.status).toBe(200)
      expect(res.body.data).toHaveLength(1)
      expect(res.body.total).toBe(1)
    })

    it('should filter by status', async () => {
      jest.spyOn(TaskService, 'getAllTasks').mockResolvedValue(mockPaginated)

      const res = await request(app).get('/api/tasks?status=todo')

      expect(res.status).toBe(200)
      expect(TaskService.getAllTasks).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'todo' })
      )
    })

    it('should return 400 for invalid status', async () => {
      const res = await request(app).get('/api/tasks?status=invalid')
      expect(res.status).toBe(400)
    })
  })

  describe('GET /api/tasks/:id', () => {
    it('should return 400 for invalid UUID', async () => {
      const res = await request(app).get('/api/tasks/not-a-uuid')
      expect(res.status).toBe(400)
      expect(res.body.errors.id).toBeDefined()
    })

    it('should return a task with 200', async () => {
      jest.spyOn(TaskService, 'getTaskById').mockResolvedValue(mockTask)

      const res = await request(app).get(`/api/tasks/${mockTask.id}`)

      expect(res.status).toBe(200)
      expect(res.body.id).toBe(mockTask.id)
    })

    it('should return 404 when task not found', async () => {
      jest.spyOn(TaskService, 'getTaskById').mockRejectedValue(new NotFoundError())

      const res = await request(app).get(`/api/tasks/${OTHER_UUID}`)

      expect(res.status).toBe(404)
    })
  })

  describe('POST /api/tasks', () => {
    it('should create a task with 201', async () => {
      jest.spyOn(TaskService, 'createTask').mockResolvedValue(mockTask)

      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task', description: 'Test Description' })

      expect(res.status).toBe(201)
      expect(res.body.title).toBe('Test Task')
    })

    it('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title here' })

      expect(res.status).toBe(400)
    })
  })

  describe('PUT /api/tasks/:id', () => {
    it('should update a task with 200', async () => {
      const updated = { ...mockTask, title: 'Updated' }
      jest.spyOn(TaskService, 'updateTask').mockResolvedValue(updated)

      const res = await request(app)
        .put(`/api/tasks/${mockTask.id}`)
        .send({ title: 'Updated' })

      expect(res.status).toBe(200)
      expect(res.body.title).toBe('Updated')
    })

    it('should return 404 when task not found', async () => {
      jest.spyOn(TaskService, 'updateTask').mockRejectedValue(new NotFoundError())

      const res = await request(app)
        .put(`/api/tasks/${OTHER_UUID}`)
        .send({ title: 'Updated' })

      expect(res.status).toBe(404)
    })
  })

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task with 204', async () => {
      jest.spyOn(TaskService, 'deleteTask').mockResolvedValue(undefined)

      const res = await request(app).delete(`/api/tasks/${mockTask.id}`)

      expect(res.status).toBe(204)
    })

    it('should return 404 when task not found', async () => {
      jest.spyOn(TaskService, 'deleteTask').mockRejectedValue(new NotFoundError())

      const res = await request(app).delete(`/api/tasks/${OTHER_UUID}`)

      expect(res.status).toBe(404)
    })
  })
})