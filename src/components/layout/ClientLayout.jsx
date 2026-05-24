import { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ClientLayout() {
  const { estaAutenticado, cargandoAuth, logout } = useAuth()

  useEffect(() => {
    async function cerrarSesionAdminEnVistaCliente() {
      if (!cargandoAuth && estaAutenticado) {
        await logout()
      }
    }

    cerrarSesionAdminEnVistaCliente()
  }, [cargandoAuth, estaAutenticado, logout])

  return (
    <div className="client-layout">
      <header className="app-header">
        <div>
          <h2>The Gordo</h2>
          <span>Sistema de reservas</span>
        </div>

        <nav>
          <Link to="/">Salón</Link>
          <Link to="/admin/login">Admin</Link>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default ClientLayout