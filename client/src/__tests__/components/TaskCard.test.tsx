import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import TaskCard from '../../components/TaskCard'
import { useTaskContext } from '../../context/TaskContext'

vi.mock('../../context/TaskContext')

const mockTask = {
  id: '123',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

describe('TaskCard', () => {
  const mockDeleteTask = vi.fn()
  const mockOnEdit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useTaskContext as ReturnType<typeof vi.fn>).mockReturnValue({
      deleteTask: mockDeleteTask,
    })
  })

  it('should render task title and description', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)

    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('should render correct status badge', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    expect(screen.getByText('Todo')).toBeInTheDocument()
  })

  it('should call onEdit when edit button clicked', () => {
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    fireEvent.click(screen.getByText('Edit'))
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask)
  })

  it('should call deleteTask when delete confirmed', () => {
    window.confirm = vi.fn().mockReturnValue(true)
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(mockDeleteTask).toHaveBeenCalledWith(mockTask.id)
  })

  it('should not call deleteTask when delete cancelled', () => {
    window.confirm = vi.fn().mockReturnValue(false)
    render(<TaskCard task={mockTask} onEdit={mockOnEdit} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(mockDeleteTask).not.toHaveBeenCalled()
  })
})
