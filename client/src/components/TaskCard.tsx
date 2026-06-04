import type { Task } from '../types/task.types'
import { useTaskContext } from '../context/TaskContext'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

const statusStyles: Record<string, string> = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
}

const statusLabels: Record<string, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { deleteTask } = useTaskContext()

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return
    await deleteTask(task.id)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-base">{task.title}</h3>
          {task.description && (
            <p className="text-gray-500 text-sm mt-1">{task.description}</p>
          )}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${statusStyles[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-400">
          {new Date(task.created_at).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-sm px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-sm px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard