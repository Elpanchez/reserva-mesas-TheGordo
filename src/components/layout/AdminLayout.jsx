import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  async function handleGoToClientView() {
    await logout()
    navigate('/')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>The Gordo</h2>
        <p>Administrador</p>

        {user && <small>{user.email}</small>}

        <nav>
          <Link to="/admin">Inicio</Link>
          <Link to="/admin/mesas">Mesas</Link>
          <Link to="/admin/reservas">Reservas</Link>
          <Link to="/admin/horarios">Horarios</Link>

          <button
            className="admin-sidebar-button"
            type="button"
            onClick={handleGoToClientView}
          >
            Vista cliente
          </button>
        </nav>

        <button
          className="admin-sidebar-button admin-sidebar-button--logout"
          type="button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout