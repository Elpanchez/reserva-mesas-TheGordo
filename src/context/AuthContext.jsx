import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  iniciarSesion,
  cerrarSesion,
  obtenerSesionActual,
  obtenerUsuarioActual,
} from '../services/authService'

const AuthContext = createContext(null)

const SESSION_TIMEOUT_MS = 20 * 1000
const LAST_ACTIVITY_KEY = 'admin_last_activity_at'

function obtenerTimestampActual() {
  return Date.now()
}

function registrarActividad() {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(obtenerTimestampActual()))
}

function obtenerUltimaActividad() {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY)

  if (!lastActivity) {
    return null
  }

  return Number(lastActivity)
}

function limpiarActividad() {
  localStorage.removeItem(LAST_ACTIVITY_KEY)
}

function sesionExpiroPorInactividad() {
  const lastActivity = obtenerUltimaActividad()

  if (!lastActivity) {
    return false
  }

  const tiempoInactivo = obtenerTimestampActual() - lastActivity

  return tiempoInactivo >= SESSION_TIMEOUT_MS
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [cargandoAuth, setCargandoAuth] = useState(true)
  const [motivoCierreSesion, setMotivoCierreSesion] = useState(null)

  const inactivityTimerRef = useRef(null)

  const limpiarTemporizador = useCallback(() => {
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current)
      inactivityTimerRef.current = null
    }
  }, [])

  const finalizarSesionPorInactividad = useCallback(async () => {
    try {
      limpiarTemporizador()
      await cerrarSesion()
    } catch (error) {
      console.error('Error cerrando sesión:', error.message)
    } finally {
      limpiarActividad()
      setSession(null)
      setUser(null)
      setMotivoCierreSesion('La sesión expiró por inactividad.')
    }
  }, [limpiarTemporizador])

  const programarCierrePorInactividad = useCallback(() => {
    limpiarTemporizador()

    const ultimaActividad = obtenerUltimaActividad() || obtenerTimestampActual()
    const tiempoInactivo = obtenerTimestampActual() - ultimaActividad
    const tiempoRestante = SESSION_TIMEOUT_MS - tiempoInactivo

    if (tiempoRestante <= 0) {
      finalizarSesionPorInactividad()
      return
    }

    inactivityTimerRef.current = window.setTimeout(() => {
      finalizarSesionPorInactividad()
    }, tiempoRestante)
  }, [finalizarSesionPorInactividad, limpiarTemporizador])

  useEffect(() => {
    async function cargarSesion() {
      try {
        const currentSession = await obtenerSesionActual()

        if (currentSession && sesionExpiroPorInactividad()) {
          await finalizarSesionPorInactividad()
          return
        }

        setSession(currentSession)

        if (currentSession) {
          registrarActividad()

          const currentUser = await obtenerUsuarioActual()
          setUser(currentUser)

          programarCierrePorInactividad()
        }
      } catch (error) {
        console.error('Error cargando sesión:', error.message)
      } finally {
        setCargandoAuth(false)
      }
    }

    cargarSesion()

    return () => {
      limpiarTemporizador()
    }
  }, [finalizarSesionPorInactividad, limpiarTemporizador, programarCierrePorInactividad])

  useEffect(() => {
    if (!session) {
      return
    }

    const eventosActividad = [
      'click',
      'keydown',
      'scroll',
      'touchstart',
    ]

    function handleActividad() {
      registrarActividad()
      programarCierrePorInactividad()
    }

    eventosActividad.forEach((evento) => {
      window.addEventListener(evento, handleActividad)
    })

    programarCierrePorInactividad()

    return () => {
      eventosActividad.forEach((evento) => {
        window.removeEventListener(evento, handleActividad)
      })

      limpiarTemporizador()
    }
  }, [session, limpiarTemporizador, programarCierrePorInactividad])

  async function login(email, password) {
    const data = await iniciarSesion(email, password)

    registrarActividad()

    setSession(data.session)
    setUser(data.user)
    setMotivoCierreSesion(null)

    programarCierrePorInactividad()

    return data
  }

  async function logout() {
    await cerrarSesion()

    limpiarTemporizador()
    limpiarActividad()

    setSession(null)
    setUser(null)
    setMotivoCierreSesion(null)
  }

  const value = {
    session,
    user,
    cargandoAuth,
    motivoCierreSesion,
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