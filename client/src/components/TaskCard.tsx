import type { Task } from '../types/task.types'
import { useTaskContext } from '../context/TaskContext'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

const statusConfig: Record<string, { label: string; pill: string; border: string }> = {
  todo:        { label: 'Todo',        pill: 'bg-slate-100 text-slate-600',   border: 'border-l-slate-400' },
  in_progress: { label: 'In Progress', pill: 'bg-blue-50 text-blue-600',     border: 'border-l-blue-500' },
  done:        { label: 'Done',        pill: 'bg-emerald-50 text-emerald-600', border: 'border-l-emerald-500' },
}

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { deleteTask } = useTaskContext()
  const config = statusConfig[task.status] ?? statusConfig['todo']

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return
    await deleteTask(task.id)
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className={`bg-white border border-slate-200 border-l-4 ${config.border} rounded-lg p-4 hover:shadow-md transition-shadow group`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-sm leading-snug truncate">{task.title}</h3>
          {task.description && (
            <p className="text-slate-400 text-xs mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${config.pill}`}>
          {config.label}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">{timeAgo(task.created_at)}</span>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
