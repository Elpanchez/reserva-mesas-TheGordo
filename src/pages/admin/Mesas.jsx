import { useState } from 'react'
import { useMesas } from '../../hooks/useMesas'
import { ESTADOS_MESA, ZONAS_MESA } from '../../utils/constants'

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

  const [formularioCrear, setFormularioCrear] = useState(estadoInicialFormulario)
  const [formularioEditar, setFormularioEditar] = useState(estadoInicialFormulario)
  const [mesaEditando, setMesaEditando] = useState(null)

  const [mensaje, setMensaje] = useState(null)
  const [errorFormulario, setErrorFormulario] = useState(null)
  const [errorEdicion, setErrorEdicion] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [guardandoEdicion, setGuardandoEdicion] = useState(false)

  const modalEdicionAbierto = Boolean(mesaEditando)

  function handleChangeCrear(event) {
    const { name, value } = event.target

    setFormularioCrear((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }))
  }

  function handleChangeEditar(event) {
    const { name, value } = event.target

    setFormularioEditar((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }))
  }

  function validarFormulario(formulario) {
    if (!formulario.numero || Number(formulario.numero) <= 0) {
      return 'El número de la mesa debe ser mayor a 0.'
    }

    if (!formulario.capacidad || Number(formulario.capacidad) <= 0) {
      return 'La capacidad debe ser mayor a 0.'
    }

    if (!formulario.ubicacion) {
      return 'Debes seleccionar una ubicación para la mesa.'
    }

    return null
  }

  function prepararMesa(formulario) {
    return {
      numero: Number(formulario.numero),
      capacidad: Number(formulario.capacidad),
      ubicacion: formulario.ubicacion,
      estado: formulario.estado,
    }
  }

  function limpiarFormularioCrear() {
    setFormularioCrear(estadoInicialFormulario)
    setErrorFormulario(null)
  }

  function abrirModalEditar(mesa) {
    setMesaEditando(mesa)
    setFormularioEditar({
      numero: String(mesa.numero),
      capacidad: String(mesa.capacidad),
      ubicacion: mesa.ubicacion,
      estado: mesa.estado,
    })
    setMensaje(null)
    setErrorEdicion(null)
  }

  function cerrarModalEditar() {
    setMesaEditando(null)
    setFormularioEditar(estadoInicialFormulario)
    setErrorEdicion(null)
  }

  async function handleCrearMesa(event) {
    event.preventDefault()

    const errorValidacion = validarFormulario(formularioCrear)

    if (errorValidacion) {
      setErrorFormulario(errorValidacion)
      return
    }

    try {
      setGuardando(true)
      setMensaje(null)
      setErrorFormulario(null)

      await agregarMesa(prepararMesa(formularioCrear))

      setMensaje('Mesa creada correctamente.')
      limpiarFormularioCrear()
    } catch (error) {
      setErrorFormulario(error.message)
    } finally {
      setGuardando(false)
    }
  }

  async function handleGuardarEdicion(event) {
    event.preventDefault()

    const errorValidacion = validarFormulario(formularioEditar)

    if (errorValidacion) {
      setErrorEdicion(errorValidacion)
      return
    }

    try {
      setGuardandoEdicion(true)
      setMensaje(null)
      setErrorEdicion(null)

      await editarMesa(mesaEditando.id, prepararMesa(formularioEditar))

      setMensaje('Mesa actualizada correctamente.')
      cerrarModalEditar()
    } catch (error) {
      setErrorEdicion(error.message)
    } finally {
      setGuardandoEdicion(false)
    }
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

      if (mesaEditando?.id === mesa.id) {
        cerrarModalEditar()
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
        <h2>Crear nueva mesa</h2>

        <form className="admin-form" onSubmit={handleCrearMesa}>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="numero">Número</label>
              <input
                id="numero"
                name="numero"
                type="number"
                min="1"
                value={formularioCrear.numero}
                onChange={handleChangeCrear}
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
                value={formularioCrear.capacidad}
                onChange={handleChangeCrear}
                placeholder="Ej: 4"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="ubicacion">Ubicación</label>
              <select
                id="ubicacion"
                name="ubicacion"
                value={formularioCrear.ubicacion}
                onChange={handleChangeCrear}
              >
                <option value="">Selecciona una zona</option>

                {ZONAS_MESA.map((zona) => (
                  <option key={zona.value} value={zona.value}>
                    {zona.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formularioCrear.estado}
                onChange={handleChangeCrear}
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
              {guardando ? 'Guardando...' : 'Crear mesa'}
            </button>
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
                          onClick={() => abrirModalEditar(mesa)}
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

      {modalEdicionAbierto && (
        <div className="admin-modal-backdrop" onClick={cerrarModalEditar}>
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editar-mesa-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal__header">
              <div>
                <h2 id="editar-mesa-title">Editar mesa</h2>
                <p>Modifica los datos de la mesa seleccionada.</p>
              </div>

              <button
                className="admin-modal__close"
                type="button"
                onClick={cerrarModalEditar}
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </div>

            <form className="admin-form" onSubmit={handleGuardarEdicion}>
              <div className="admin-form__grid">
                <div className="admin-field">
                  <label htmlFor="editar-numero">Número</label>
                  <input
                    id="editar-numero"
                    name="numero"
                    type="number"
                    min="1"
                    value={formularioEditar.numero}
                    onChange={handleChangeEditar}
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="editar-capacidad">Capacidad</label>
                  <input
                    id="editar-capacidad"
                    name="capacidad"
                    type="number"
                    min="1"
                    value={formularioEditar.capacidad}
                    onChange={handleChangeEditar}
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="editar-ubicacion">Ubicación</label>
                  <select
                    id="editar-ubicacion"
                    name="ubicacion"
                    value={formularioEditar.ubicacion}
                    onChange={handleChangeEditar}
                  >
                    <option value="">Selecciona una zona</option>

                    {ZONAS_MESA.map((zona) => (
                      <option key={zona.value} value={zona.value}>
                        {zona.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-field">
                  <label htmlFor="editar-estado">Estado</label>
                  <select
                    id="editar-estado"
                    name="estado"
                    value={formularioEditar.estado}
                    onChange={handleChangeEditar}
                  >
                    <option value={ESTADOS_MESA.DISPONIBLE}>Disponible</option>
                    <option value={ESTADOS_MESA.OCUPADA}>Ocupada</option>
                    <option value={ESTADOS_MESA.BLOQUEADA}>Bloqueada</option>
                  </select>
                </div>
              </div>

              {errorEdicion && (
                <p className="admin-message admin-message--error">
                  {errorEdicion}
                </p>
              )}

              <div className="admin-modal__footer">
                <button
                  className="admin-button admin-button--secondary"
                  type="button"
                  onClick={cerrarModalEditar}
                >
                  Cancelar
                </button>

                <button
                  className="admin-button admin-button--primary"
                  type="submit"
                  disabled={guardandoEdicion}
                >
                  {guardandoEdicion ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MesasPage