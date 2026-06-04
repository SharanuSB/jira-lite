import { useTaskContext } from '../context/TaskContext'
import type { TaskStatus } from '../types/task.types'

const statusOptions: { label: string; value: TaskStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
]

const TaskFilters = () => {
  const { filters, setFilters } = useTaskContext()

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={e => setFilters({ search: e.target.value })}
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
        />
      </div>
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        {statusOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilters({ status: opt.value as TaskStatus | undefined || undefined })}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              (filters.status || '') === opt.value
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaskFilters
