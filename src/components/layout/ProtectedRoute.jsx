import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
  const { estaAutenticado, cargandoAuth } = useAuth()

  if (cargandoAuth) {
    return <p>Cargando sesión...</p>
  }

  if (!estaAutenticado) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute