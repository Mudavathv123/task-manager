import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type AuthContextType = {
  token: string | null
  setToken: (t: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('tm.token')
    if (saved) setTokenState(saved)
  }, [])

  const setToken = (t: string | null) => {
    setTokenState(t)
    if (t) localStorage.setItem('tm.token', t)
    else localStorage.removeItem('tm.token')
  }

  const logout = () => setToken(null)

  const value = useMemo(() => ({ token, setToken, logout }), [token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}



