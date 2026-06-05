import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import TaskForm from '../../components/TaskForm'
import { useTaskContext } from '../../context/TaskContext'

vi.mock('../../context/TaskContext')

const mockCreateTask = vi.fn()
const mockUpdateTask = vi.fn()

const mockTask = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Existing Task',
  description: 'Existing Description',
  status: 'in_progress' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

describe('TaskForm', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useTaskContext as ReturnType<typeof vi.fn>).mockReturnValue({
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
    })
  })

  describe('Create mode', () => {
    it('should render empty form with "New Task" heading', () => {
      render(<TaskForm onClose={mockOnClose} />)
      expect(screen.getByText('New Task')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('What needs to be done?')).toHaveValue('')
    })

    it('should show validation error when submitting without a title', async () => {
      render(<TaskForm onClose={mockOnClose} />)
      fireEvent.click(screen.getByText('Create Task'))
      expect(await screen.findByText('Title is required')).toBeInTheDocument()
      expect(mockCreateTask).not.toHaveBeenCalled()
    })

    it('should call createTask and close on successful submit', async () => {
      mockCreateTask.mockResolvedValue(undefined)
      render(<TaskForm onClose={mockOnClose} />)

      fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), {
        target: { value: 'New Task Title' },
      })
      fireEvent.change(screen.getByPlaceholderText('Add more details...'), {
        target: { value: 'Some description' },
      })
      fireEvent.click(screen.getByText('Create Task'))

      await waitFor(() => {
        expect(mockCreateTask).toHaveBeenCalledWith({
          title: 'New Task Title',
          description: 'Some description',
          status: 'todo',
        })
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('should show error message when createTask throws', async () => {
      mockCreateTask.mockRejectedValue(new Error('Server error'))
      render(<TaskForm onClose={mockOnClose} />)

      fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), {
        target: { value: 'Some Task' },
      })
      fireEvent.click(screen.getByText('Create Task'))

      expect(await screen.findByText('Server error')).toBeInTheDocument()
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Edit mode', () => {
    it('should pre-fill form fields with existing task data', () => {
      render(<TaskForm taskToEdit={mockTask} onClose={mockOnClose} />)
      expect(screen.getByText('Edit Task')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('What needs to be done?')).toHaveValue('Existing Task')
      expect(screen.getByPlaceholderText('Add more details...')).toHaveValue('Existing Description')
    })

    it('should call updateTask with changed values on submit', async () => {
      mockUpdateTask.mockResolvedValue(undefined)
      render(<TaskForm taskToEdit={mockTask} onClose={mockOnClose} />)

      fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), {
        target: { value: 'Updated Title' },
      })
      fireEvent.click(screen.getByText('Save Changes'))

      await waitFor(() => {
        expect(mockUpdateTask).toHaveBeenCalledWith(mockTask.id, {
          title: 'Updated Title',
          description: 'Existing Description',
          status: 'in_progress',
        })
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })

  it('should call onClose when Cancel is clicked', () => {
    render(<TaskForm onClose={mockOnClose} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalled()
  })
})
