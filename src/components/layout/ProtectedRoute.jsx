import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { estaAutenticado, cargandoAuth } = useAuth()

  if (cargandoAuth) {
    return <p>Cargando sesión...</p>
  }

  if (!estaAutenticado) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return children
}

export default ProtectedRoute