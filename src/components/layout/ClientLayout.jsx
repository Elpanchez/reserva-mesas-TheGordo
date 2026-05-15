import { Link, Outlet } from 'react-router-dom'

function ClientLayout() {
  return (
    <div className="client-layout">
      <header className="app-header">
        <div>
          <h2>The Gordo</h2>
          <span>Sistema de reservas</span>
        </div>

        <nav>
          <Link to="/">Salón</Link>
          <Link to="/reservar">Reservar</Link>
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