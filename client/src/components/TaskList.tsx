import { useState } from 'react'
import type { Task } from '../types/task.types'
import { useTaskContext } from '../context/TaskContext'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import TaskFilters from './TaskFilters'

const TaskList = () => {
  const { tasks, loading, error, page, totalPages, total, setFilters } = useTaskContext()
  const [showForm, setShowForm] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

  const handleEdit = (task: Task) => {
    setTaskToEdit(task)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setTaskToEdit(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          <p className="text-sm text-gray-500 mt-1">{total} tasks total</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + New Task
        </button>
      </div>

      <TaskFilters />

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No tasks found</p>
          <p className="text-sm mt-1">Create your first task to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setFilters({ page: page - 1 })}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setFilters({ page: page + 1 })}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {showForm && (
        <TaskForm taskToEdit={taskToEdit} onClose={handleClose} />
      )}
    </div>
  )
}

export default TaskList