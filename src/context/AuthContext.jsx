import { createContext, useContext, useEffect, useState } from 'react'
import {
  iniciarSesion,
  cerrarSesion,
  obtenerSesionActual,
  obtenerUsuarioActual,
} from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [cargandoAuth, setCargandoAuth] = useState(true)

  useEffect(() => {
    async function cargarSesion() {
      try {
        const currentSession = await obtenerSesionActual()
        setSession(currentSession)

        if (currentSession) {
          const currentUser = await obtenerUsuarioActual()
          setUser(currentUser)
        }
      } catch (error) {
        console.error('Error cargando sesión:', error.message)
      } finally {
        setCargandoAuth(false)
      }
    }

    cargarSesion()
  }, [])

  async function login(email, password) {
    const data = await iniciarSesion(email, password)

    setSession(data.session)
    setUser(data.user)

    return data
  }

  async function logout() {
    await cerrarSesion()

    setSession(null)
    setUser(null)
  }

  const value = {
    session,
    user,
    cargandoAuth,
    estaAutenticado: Boolean(session),
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}