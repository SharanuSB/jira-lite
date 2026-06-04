import { useTaskContext } from '../context/TaskContext'

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
]

const TaskFilters = () => {
  const { filters, setFilters } = useTaskContext()

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.search || ''}
        onChange={e => setFilters({ search: e.target.value })}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={filters.status || ''}
        onChange={e => setFilters({ status: e.target.value as any || undefined })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {statusOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TaskFilters