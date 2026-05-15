import { Link, Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>The Gordo</h2>
        <p>Administrador</p>

        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/mesas">Mesas</Link>
          <Link to="/admin/reservas">Reservas</Link>
          <Link to="/admin/horarios">Horarios</Link>
          <Link to="/">Vista cliente</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout