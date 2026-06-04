import { Toaster } from 'react-hot-toast'
import { TaskProvider } from './context/TaskContext'
import TaskList from './components/TaskList'

const App = () => {
  return (
    <TaskProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
        <header className="bg-white border-b border-slate-200 shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">Jira Lite</span>
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          <TaskList />
        </div>
      </div>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </TaskProvider>
  )
}

export default App
