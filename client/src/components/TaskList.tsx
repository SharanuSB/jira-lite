import { useState } from 'react'
import type { Task } from '../types/task.types'
import { useTaskContext } from '../context/TaskContext'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import TaskFilters from './TaskFilters'

const TaskList = () => {
  const { tasks, loading, error, page, totalPages, total, setFilters, retryFetch } = useTaskContext()
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
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full px-4">

      {/* Title + New Task button */}
      <div className="flex items-center justify-between py-5 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Tasks</h1>
          <p className="text-sm text-slate-400 mt-0.5">{total} {total === 1 ? 'task' : 'tasks'}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="shrink-0">
        <TaskFilters />
      </div>

      {/* Error banner */}
      {error && (
        <div className="shrink-0 flex items-center justify-between gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm border border-red-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
          <button
            onClick={retryFetch}
            className="shrink-0 text-xs font-medium underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Scrollable card area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-slate-600">No tasks found</p>
              <p className="text-sm text-slate-400 mt-0.5">Create your first task to get started</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              + Create a task
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 pb-2">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination — always at bottom */}
      <div className="shrink-0 border-t border-slate-200 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {totalPages > 0 ? `Page ${page} of ${totalPages}` : ''}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ page: page - 1 })}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setFilters({ page: page + 1 })}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <TaskForm taskToEdit={taskToEdit} onClose={handleClose} />
      )}
    </div>
  )
}

export default TaskList
