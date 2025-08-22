import { useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthContext'
import { useApi } from '../utils/api'

type Task = {
  id: number
  title: string
  description?: string
  completed: boolean
}

export default function TasksPage() {
  const { logout } = useAuth()
  const api = useApi()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<{ id?: number; title: string; description: string; completed: boolean }>({ title: '', description: '', completed: false })

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/tasks')
      setTasks(data)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const submit = async () => {
    try {
      if (form.id) {
        const { data } = await api.put(`/tasks/${form.id}`, { title: form.title, description: form.description, completed: form.completed })
        setTasks(prev => prev.map(t => t.id === form.id ? data : t))
      } else {
        const { data } = await api.post('/tasks', { title: form.title, description: form.description, completed: form.completed })
        setTasks(prev => [data, ...prev])
      }
      setForm({ title: '', description: '', completed: false })
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to save')
    }
  }

  const edit = (t: Task) => setForm({ id: t.id, title: t.title, description: t.description || '', completed: t.completed })

  const remove = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to delete')
    }
  }

  const toggleTaskStatus = async (taskId: number, completed: boolean) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { completed })
      setTasks(prev => prev.map(t => t.id === taskId ? data : t))
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to update task status')
    }
  }

  return (
    <div className="grid">
      <div className="row">
        <h2>My Tasks</h2>
        <div className="spacer" />
        <button className="btn secondary" onClick={logout}>Logout</button>
      </div>
      {loading ? <div className="card">Loading...</div> : (
        <div className="grid">
          {error && <div className="card error">{error}</div>}
          <div className="card">
            <h3>{form.id ? 'Edit Task' : 'Add Task'}</h3>
            <div className="form">
              <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <label className="row"><input type="checkbox" checked={form.completed} onChange={e => setForm({ ...form, completed: e.target.checked })} /> Completed</label>
              <div className="row">
                <button className="btn" onClick={submit}>{form.id ? 'Update' : 'Create'}</button>
                {form.id && <button className="btn secondary" onClick={() => setForm({ title: '', description: '', completed: false })}>Cancel</button>}
              </div>
            </div>
          </div>

          <div className="tasks">
            {tasks.length === 0 && <div className="card empty">No tasks yet. Add your first task!</div>}
            {tasks.map(t => (
              <div key={t.id} className="task-item">
                <input 
                  type="checkbox" 
                  checked={t.completed} 
                  onChange={e => toggleTaskStatus(t.id, e.target.checked)} 
                />
                <div style={{ flex: 1 }}>
                  <div className="task-title">{t.title}</div>
                  <div className="task-desc">{t.description}</div>
                </div>
                <div className="row">
                  <button className="btn secondary" onClick={() => edit(t)}>Edit</button>
                  <button className="btn danger" onClick={() => remove(t.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


