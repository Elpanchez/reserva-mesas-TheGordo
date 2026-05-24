import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useReservas } from '../../hooks/useReservas'
import { ESTADOS_RESERVA, RUTAS } from '../../utils/constants'

function obtenerFechaActual() {
  const fecha = new Date()
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  const day = String(fecha.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatearHora(hora) {
  if (!hora) return ''
  return hora.slice(0, 5)
}

function obtenerMesaReserva(reserva) {
  if (!reserva.mesas) {
    return 'Mesa no disponible'
  }

  return `Mesa ${reserva.mesas.numero}`
}

function DashboardPage() {
  const {
    reservas,
    cargando,
    error,
    cargarReservas,
  } = useReservas(true)

  const hoy = obtenerFechaActual()

  const reservasHoy = useMemo(() => {
    return reservas
      .filter(
        (reserva) =>
          reserva.fecha === hoy &&
          reserva.estado === ESTADOS_RESERVA.ACTIVA
      )
      .sort((a, b) => a.hora.localeCompare(b.hora))
  }, [reservas, hoy])

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1>Panel operativo</h1>
          <p>
            Accede rápidamente a las funciones principales del sistema de
            reservas.
          </p>
        </div>

        <button
          className="admin-button admin-button--secondary"
          type="button"
          onClick={cargarReservas}
        >
          Actualizar
        </button>
      </header>

      <section className="admin-home-actions">
        <Link className="admin-home-action" to={RUTAS.ADMIN_RESERVAS}>
          <span>Reservas</span>
          <strong>Ver y gestionar reservas</strong>
          <p>Consulta, cancela o marca reservas como completadas.</p>
        </Link>

        <Link className="admin-home-action" to={RUTAS.ADMIN_MESAS}>
          <span>Mesas</span>
          <strong>Gestionar mesas</strong>
          <p>Crea, edita, bloquea o desbloquea mesas del restaurante.</p>
        </Link>

        <Link className="admin-home-action" to={RUTAS.ADMIN_HORARIOS}>
          <span>Horarios</span>
          <strong>Gestionar horarios</strong>
          <p>Configura los días y rangos disponibles para reservar.</p>
        </Link>
      </section>

      <section className="admin-card">
        <div className="admin-page__header">
          <div>
            <h2>Reservas activas de hoy</h2>
            <p>
              Reservas pendientes para atender durante la jornada actual.
            </p>
          </div>

          <Link
            className="admin-button admin-button--primary"
            to={RUTAS.ADMIN_RESERVAS}
          >
            Ver todas
          </Link>
        </div>

        {cargando && <p>Cargando reservas de hoy...</p>}

        {error && (
          <p className="admin-message admin-message--error">{error}</p>
        )}

        {!cargando && !error && reservasHoy.length === 0 && (
          <div className="admin-empty">
            <h3>No hay reservas activas para hoy</h3>
            <p>
              Cuando existan reservas activas para la fecha actual, aparecerán
              en esta sección.
            </p>
          </div>
        )}

        {!cargando && !error && reservasHoy.length > 0 && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Mesa</th>
                  <th>Personas</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {reservasHoy.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>{formatearHora(reserva.hora)}</td>

                    <td>
                      <strong>{reserva.cliente_nombre}</strong>
                    </td>

                    <td>
                      <span>{reserva.cliente_tel}</span>
                      <br />
                      <small>{reserva.cliente_email}</small>
                    </td>

                    <td>{obtenerMesaReserva(reserva)}</td>

                    <td>{reserva.num_personas}</td>

                    <td>
                      <span className="status-badge status-badge--activa">
                        {reserva.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default DashboardPage