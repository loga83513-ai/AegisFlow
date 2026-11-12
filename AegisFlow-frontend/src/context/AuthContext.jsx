import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem('user_role') || null
  )

  const login = (role) => {
    localStorage.setItem('user_role', role)
    setUserRole(role)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_role')

    setUserRole(null)
  }

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}