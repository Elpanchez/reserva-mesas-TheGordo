import { useState } from 'react'
import { useMesas } from '../../hooks/useMesas'
import { ESTADOS_MESA } from '../../utils/constants'

const estadoInicialFormulario = {
  numero: '',
  capacidad: '',
  ubicacion: '',
  estado: ESTADOS_MESA.DISPONIBLE,
}

function MesasPage() {
  const {
    mesas,
    cargando,
    error,
    agregarMesa,
    editarMesa,
    bloquear,
    desbloquear,
    eliminar,
  } = useMesas()

  const [formulario, setFormulario] = useState(estadoInicialFormulario)
  const [mesaEditandoId, setMesaEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [errorFormulario, setErrorFormulario] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const estaEditando = Boolean(mesaEditandoId)

  function handleChange(event) {
    const { name, value } = event.target

    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }))
  }

  function limpiarFormulario() {
    setFormulario(estadoInicialFormulario)
    setMesaEditandoId(null)
    setErrorFormulario(null)
  }

  function validarFormulario() {
    if (!formulario.numero || Number(formulario.numero) <= 0) {
      return 'El número de la mesa debe ser mayor a 0.'
    }

    if (!formulario.capacidad || Number(formulario.capacidad) <= 0) {
      return 'La capacidad debe ser mayor a 0.'
    }

    if (!formulario.ubicacion.trim()) {
      return 'La ubicación de la mesa es obligatoria.'
    }

    return null
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errorValidacion = validarFormulario()

    if (errorValidacion) {
      setErrorFormulario(errorValidacion)
      return
    }

    const mesa = {
      numero: Number(formulario.numero),
      capacidad: Number(formulario.capacidad),
      ubicacion: formulario.ubicacion.trim(),
      estado: formulario.estado,
    }

    try {
      setGuardando(true)
      setMensaje(null)
      setErrorFormulario(null)

      if (estaEditando) {
        await editarMesa(mesaEditandoId, mesa)
        setMensaje('Mesa actualizada correctamente.')
      } else {
        await agregarMesa(mesa)
        setMensaje('Mesa creada correctamente.')
      }

      limpiarFormulario()
    } catch (error) {
      setErrorFormulario(error.message)
    } finally {
      setGuardando(false)
    }
  }

  function cargarMesaParaEditar(mesa) {
    setMesaEditandoId(mesa.id)
    setFormulario({
      numero: String(mesa.numero),
      capacidad: String(mesa.capacidad),
      ubicacion: mesa.ubicacion,
      estado: mesa.estado,
    })
    setMensaje(null)
    setErrorFormulario(null)
  }

  async function handleCambiarBloqueo(mesa) {
    try {
      setMensaje(null)
      setErrorFormulario(null)

      if (mesa.estado === ESTADOS_MESA.BLOQUEADA) {
        await desbloquear(mesa.id)
        setMensaje(`Mesa ${mesa.numero} desbloqueada correctamente.`)
      } else {
        await bloquear(mesa.id)
        setMensaje(`Mesa ${mesa.numero} bloqueada correctamente.`)
      }
    } catch (error) {
      setErrorFormulario(error.message)
    }
  }

  async function handleEliminarMesa(mesa) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la mesa ${mesa.numero}?`
    )

    if (!confirmar) return

    try {
      setMensaje(null)
      setErrorFormulario(null)

      await eliminar(mesa.id)
      setMensaje(`Mesa ${mesa.numero} eliminada correctamente.`)

      if (mesaEditandoId === mesa.id) {
        limpiarFormulario()
      }
    } catch (error) {
      setErrorFormulario(
        'No se pudo eliminar la mesa. Es posible que tenga reservas asociadas.'
      )
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1>Gestión de mesas</h1>
          <p>
            Crea, edita, bloquea o elimina las mesas disponibles para reservas.
          </p>
        </div>
      </header>

      <section className="admin-card">
        <h2>{estaEditando ? 'Editar mesa' : 'Crear nueva mesa'}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="numero">Número</label>
              <input
                id="numero"
                name="numero"
                type="number"
                min="1"
                value={formulario.numero}
                onChange={handleChange}
                placeholder="Ej: 1"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="capacidad">Capacidad</label>
              <input
                id="capacidad"
                name="capacidad"
                type="number"
                min="1"
                value={formulario.capacidad}
                onChange={handleChange}
                placeholder="Ej: 4"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="ubicacion">Ubicación</label>
              <input
                id="ubicacion"
                name="ubicacion"
                type="text"
                value={formulario.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Zona central"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formulario.estado}
                onChange={handleChange}
              >
                <option value={ESTADOS_MESA.DISPONIBLE}>Disponible</option>
                <option value={ESTADOS_MESA.OCUPADA}>Ocupada</option>
                <option value={ESTADOS_MESA.BLOQUEADA}>Bloqueada</option>
              </select>
            </div>
          </div>

          {errorFormulario && (
            <p className="admin-message admin-message--error">
              {errorFormulario}
            </p>
          )}

          {mensaje && (
            <p className="admin-message admin-message--success">{mensaje}</p>
          )}

          <div className="admin-actions">
            <button
              className="admin-button admin-button--primary"
              type="submit"
              disabled={guardando}
            >
              {guardando
                ? 'Guardando...'
                : estaEditando
                  ? 'Guardar cambios'
                  : 'Crear mesa'}
            </button>

            {estaEditando && (
              <button
                className="admin-button admin-button--secondary"
                type="button"
                onClick={limpiarFormulario}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-card">
        <h2>Mesas registradas</h2>

        {cargando && <p>Cargando mesas...</p>}

        {error && (
          <p className="admin-message admin-message--error">{error}</p>
        )}

        {!cargando && !error && mesas.length === 0 && (
          <p>No hay mesas registradas todavía.</p>
        )}

        {!cargando && !error && mesas.length > 0 && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Capacidad</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {mesas.map((mesa) => (
                  <tr key={mesa.id}>
                    <td>Mesa {mesa.numero}</td>
                    <td>{mesa.capacidad} personas</td>
                    <td>{mesa.ubicacion}</td>
                    <td>
                      <span
                        className={`status-badge status-badge--${mesa.estado}`}
                      >
                        {mesa.estado}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-button admin-button--secondary"
                          type="button"
                          onClick={() => cargarMesaParaEditar(mesa)}
                        >
                          Editar
                        </button>

                        <button
                          className="admin-button admin-button--ghost"
                          type="button"
                          onClick={() => handleCambiarBloqueo(mesa)}
                        >
                          {mesa.estado === ESTADOS_MESA.BLOQUEADA
                            ? 'Desbloquear'
                            : 'Bloquear'}
                        </button>

                        <button
                          className="admin-button admin-button--danger"
                          type="button"
                          onClick={() => handleEliminarMesa(mesa)}
                        >
                          Eliminar
                        </button>
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

export default MesasPage