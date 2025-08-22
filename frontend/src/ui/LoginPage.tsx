import { FormEvent, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { API_BASE } from '../utils/api'

export default function LoginPage() {
  const nav = useNavigate()
  const { setToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password })
      setToken(data.token)
      nav('/')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2>Welcome back</h2>
        <p className="muted">Log in to continue managing your tasks</p>
        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" required />
          </div>
          <div className="row">
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className="card">
        <h3>Why Task Manager?</h3>
        <p className="muted">Fast, simple, and secure way to stay organized.</p>
        <ul>
          <li>Create and edit tasks</li>
          <li>Toggle completion easily</li>
          <li>Your data stays private</li>
        </ul>
      </div>
    </div>
  )
}


