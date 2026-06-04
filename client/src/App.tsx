import { TaskProvider } from './context/TaskContext'
import TaskList from './components/TaskList'

const App = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50">
        <TaskList />
      </div>
    </TaskProvider>
  )
}

export default App