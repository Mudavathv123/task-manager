import axios from 'axios'
import { useAuth } from './AuthContext'

export const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export const api = axios.create({ baseURL: API_BASE })

export function authHeaders(token: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useApi() {
  const { token } = useAuth()
  const instance = axios.create({ baseURL: API_BASE, headers: authHeaders(token) })
  return instance
}


