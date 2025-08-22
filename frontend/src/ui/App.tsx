import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from '../utils/AuthContext'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import TasksPage from './TasksPage'
import './styles.css'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <div className="navbar">
        <div className="container navbar-inner">
          <div className="brand"><div className="logo" /> Task Manager</div>
          <div className="nav-actions">
            <Link className="btn secondary" to="/">Tasks</Link>
            <Link className="btn secondary" to="/login">Login</Link>
            <Link className="btn" to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
      <div className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}


