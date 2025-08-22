import { FormEvent, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { API_BASE } from '../utils/api'

export default function SignupPage() {
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
      const { data } = await axios.post(`${API_BASE}/auth/signup`, { email, password })
      setToken(data.token)
      nav('/')
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2>Create your account</h2>
        <p className="muted">Start organizing in minutes</p>
        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Choose a strong password" required />
          </div>
          <div className="row">
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className="card">
        <h3>Stay on top of your day</h3>
        <p className="muted">Simple tools to track progress and focus on what matters.</p>
      </div>
    </div>
  )
}


