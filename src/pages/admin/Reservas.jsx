import { useMemo, useState } from 'react'
import { useReservas } from '../../hooks/useReservas'
import { ESTADOS_RESERVA } from '../../utils/constants'

const filtrosIniciales = {
  fecha: '',
  estado: '',
  busqueda: '',
}

function formatearHora(hora) {
  if (!hora) return ''
  return hora.slice(0, 5)
}

function formatearFecha(fecha) {
  if (!fecha) return ''

  const [year, month, day] = fecha.split('-')
  return `${day}/${month}/${year}`
}

function obtenerMesaReserva(reserva) {
  if (!reserva.mesas) {
    return 'Mesa no disponible'
  }

  return `Mesa ${reserva.mesas.numero}`
}

function ReservasPage() {
  const {
    reservas,
    cargando,
    error,
    cargarReservas,
    cargarReservasPorFecha,
    cancelar,
    completar,
  } = useReservas(true)

  const [filtros, setFiltros] = useState(filtrosIniciales)
  const [mensaje, setMensaje] = useState(null)
  const [errorAccion, setErrorAccion] = useState(null)
  const [procesandoId, setProcesandoId] = useState(null)

  const reservasFiltradas = useMemo(() => {
    return reservas.filter((reserva) => {
      const coincideEstado = filtros.estado
        ? reserva.estado === filtros.estado
        : true

      const textoBusqueda = filtros.busqueda.toLowerCase().trim()

      const coincideBusqueda = textoBusqueda
        ? reserva.cliente_nombre.toLowerCase().includes(textoBusqueda) ||
          reserva.cliente_tel.toLowerCase().includes(textoBusqueda) ||
          reserva.cliente_email.toLowerCase().includes(textoBusqueda)
        : true

      return coincideEstado && coincideBusqueda
    })
  }, [reservas, filtros.estado, filtros.busqueda])

  function handleChangeFiltro(event) {
    const { name, value } = event.target

    setFiltros((filtrosActuales) => ({
      ...filtrosActuales,
      [name]: value,
    }))
  }

  async function handleFiltrarPorFecha(event) {
    event.preventDefault()

    try {
      setMensaje(null)
      setErrorAccion(null)

      if (filtros.fecha) {
        await cargarReservasPorFecha(filtros.fecha)
      } else {
        await cargarReservas()
      }
    } catch (error) {
      setErrorAccion(error.message)
    }
  }

  async function limpiarFiltros() {
    try {
      setFiltros(filtrosIniciales)
      setMensaje(null)
      setErrorAccion(null)
      await cargarReservas()
    } catch (error) {
      setErrorAccion(error.message)
    }
  }

  async function handleCancelarReserva(reserva) {
    const confirmar = window.confirm(
      `¿Seguro que deseas cancelar la reserva de ${reserva.cliente_nombre}?`
    )

    if (!confirmar) return

    try {
      setProcesandoId(reserva.id)
      setMensaje(null)
      setErrorAccion(null)

      await cancelar(reserva.id)

      setMensaje('Reserva cancelada correctamente.')
    } catch (error) {
      setErrorAccion(error.message)
    } finally {
      setProcesandoId(null)
    }
  }

  async function handleCompletarReserva(reserva) {
    const confirmar = window.confirm(
      `¿Seguro que deseas marcar como completada la reserva de ${reserva.cliente_nombre}?`
    )

    if (!confirmar) return

    try {
      setProcesandoId(reserva.id)
      setMensaje(null)
      setErrorAccion(null)

      await completar(reserva.id)

      setMensaje('Reserva marcada como completada correctamente.')
    } catch (error) {
      setErrorAccion(error.message)
    } finally {
      setProcesandoId(null)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1>Gestión de reservas</h1>
          <p>
            Consulta, filtra, cancela o marca como completadas las reservas
            realizadas por los clientes.
          </p>
        </div>
      </header>

      <section className="admin-card">
        <h2>Filtros de búsqueda</h2>

        <form className="admin-form" onSubmit={handleFiltrarPorFecha}>
          <div className="admin-form__grid admin-form__grid--filters">
            <div className="admin-field">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                name="fecha"
                type="date"
                value={filtros.fecha}
                onChange={handleChangeFiltro}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={filtros.estado}
                onChange={handleChangeFiltro}
              >
                <option value="">Todos los estados</option>
                <option value={ESTADOS_RESERVA.ACTIVA}>Activa</option>
                <option value={ESTADOS_RESERVA.CANCELADA}>Cancelada</option>
                <option value={ESTADOS_RESERVA.COMPLETADA}>Completada</option>
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="busqueda">Buscar cliente</label>
              <input
                id="busqueda"
                name="busqueda"
                type="text"
                value={filtros.busqueda}
                onChange={handleChangeFiltro}
                placeholder="Nombre, teléfono o correo"
              />
            </div>
          </div>

          <div className="admin-actions">
            <button className="admin-button admin-button--primary" type="submit">
              Aplicar filtros
            </button>

            <button
              className="admin-button admin-button--secondary"
              type="button"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          </div>
        </form>
      </section>

      <section className="admin-card">
        <div className="admin-page__header">
          <div>
            <h2>Reservas registradas</h2>
            <p>Total mostrado: {reservasFiltradas.length}</p>
          </div>

          <button
            className="admin-button admin-button--secondary"
            type="button"
            onClick={cargarReservas}
          >
            Recargar
          </button>
        </div>

        {mensaje && (
          <p className="admin-message admin-message--success">{mensaje}</p>
        )}

        {errorAccion && (
          <p className="admin-message admin-message--error">{errorAccion}</p>
        )}

        {cargando && <p>Cargando reservas...</p>}

        {error && (
          <p className="admin-message admin-message--error">{error}</p>
        )}

        {!cargando && !error && reservasFiltradas.length === 0 && (
          <p>No hay reservas para mostrar.</p>
        )}

        {!cargando && !error && reservasFiltradas.length > 0 && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Mesa</th>
                  <th>Personas</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {reservasFiltradas.map((reserva) => (
                  <tr key={reserva.id}>
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

                    <td>{formatearFecha(reserva.fecha)}</td>

                    <td>{formatearHora(reserva.hora)}</td>

                    <td>
                      <span
                        className={`status-badge status-badge--${reserva.estado}`}
                      >
                        {reserva.estado}
                      </span>
                    </td>

                    <td>
                      <div className="admin-actions">
                        {reserva.estado === ESTADOS_RESERVA.ACTIVA && (
                          <>
                            <button
                              className="admin-button admin-button--secondary"
                              type="button"
                              disabled={procesandoId === reserva.id}
                              onClick={() => handleCompletarReserva(reserva)}
                            >
                              Completar
                            </button>

                            <button
                              className="admin-button admin-button--danger"
                              type="button"
                              disabled={procesandoId === reserva.id}
                              onClick={() => handleCancelarReserva(reserva)}
                            >
                              Cancelar
                            </button>
                          </>
                        )}

                        {reserva.estado !== ESTADOS_RESERVA.ACTIVA && (
                          <span className="admin-muted">
                            Sin acciones disponibles
                          </span>
                        )}
                      </div>
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

export default ReservasPage