import { useState } from 'react'
import { useHorarios } from '../../hooks/useHorarios'
import { DIAS_SEMANA } from '../../utils/constants'

const estadoInicialFormulario = {
  dia_semana: '',
  hora_inicio: '',
  hora_fin: '',
  activo: true,
}

function obtenerNombreDia(diaSemana) {
  const dia = DIAS_SEMANA.find((item) => item.value === Number(diaSemana))
  return dia ? dia.label : 'Sin día'
}

function formatearHora(hora) {
  if (!hora) return ''
  return hora.slice(0, 5)
}

function HorariosPage() {
  const {
    horarios,
    cargando,
    error,
    agregarHorario,
    editarHorario,
    cambiarEstado,
    eliminar,
  } = useHorarios()

  const [formularioCrear, setFormularioCrear] = useState(estadoInicialFormulario)
  const [formularioEditar, setFormularioEditar] = useState(estadoInicialFormulario)
  const [horarioEditando, setHorarioEditando] = useState(null)

  const [mensaje, setMensaje] = useState(null)
  const [errorFormulario, setErrorFormulario] = useState(null)
  const [errorEdicion, setErrorEdicion] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [guardandoEdicion, setGuardandoEdicion] = useState(false)

  const modalEdicionAbierto = Boolean(horarioEditando)

  function handleChangeCrear(event) {
    const { name, value, type, checked } = event.target

    setFormularioCrear((formularioActual) => ({
      ...formularioActual,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleChangeEditar(event) {
    const { name, value, type, checked } = event.target

    setFormularioEditar((formularioActual) => ({
      ...formularioActual,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function validarFormulario(formulario) {
    if (!formulario.dia_semana) {
      return 'Debes seleccionar un día de la semana.'
    }

    if (!formulario.hora_inicio) {
      return 'La hora de inicio es obligatoria.'
    }

    if (!formulario.hora_fin) {
      return 'La hora de fin es obligatoria.'
    }

    if (formulario.hora_fin <= formulario.hora_inicio) {
      return 'La hora de fin debe ser mayor que la hora de inicio.'
    }

    return null
  }

  function prepararHorario(formulario) {
    return {
      dia_semana: Number(formulario.dia_semana),
      hora_inicio: formulario.hora_inicio,
      hora_fin: formulario.hora_fin,
      activo: formulario.activo,
    }
  }

  function limpiarFormularioCrear() {
    setFormularioCrear(estadoInicialFormulario)
    setErrorFormulario(null)
  }

  function abrirModalEditar(horario) {
    setHorarioEditando(horario)

    setFormularioEditar({
      dia_semana: String(horario.dia_semana),
      hora_inicio: formatearHora(horario.hora_inicio),
      hora_fin: formatearHora(horario.hora_fin),
      activo: horario.activo,
    })

    setMensaje(null)
    setErrorEdicion(null)
  }

  function cerrarModalEditar() {
    setHorarioEditando(null)
    setFormularioEditar(estadoInicialFormulario)
    setErrorEdicion(null)
  }

  async function handleCrearHorario(event) {
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

      await agregarHorario(prepararHorario(formularioCrear))

      setMensaje('Horario creado correctamente.')
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

      await editarHorario(horarioEditando.id, prepararHorario(formularioEditar))

      setMensaje('Horario actualizado correctamente.')
      cerrarModalEditar()
    } catch (error) {
      setErrorEdicion(error.message)
    } finally {
      setGuardandoEdicion(false)
    }
  }

  async function handleCambiarEstadoHorario(horario) {
    try {
      setMensaje(null)
      setErrorFormulario(null)

      await cambiarEstado(horario.id, !horario.activo)

      setMensaje(
        horario.activo
          ? 'Horario desactivado correctamente.'
          : 'Horario activado correctamente.'
      )
    } catch (error) {
      setErrorFormulario(error.message)
    }
  }

  async function handleEliminarHorario(horario) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el horario de ${obtenerNombreDia(
        horario.dia_semana
      )} de ${formatearHora(horario.hora_inicio)} a ${formatearHora(
        horario.hora_fin
      )}?`
    )

    if (!confirmar) return

    try {
      setMensaje(null)
      setErrorFormulario(null)

      await eliminar(horario.id)
      setMensaje('Horario eliminado correctamente.')

      if (horarioEditando?.id === horario.id) {
        cerrarModalEditar()
      }
    } catch (error) {
      setErrorFormulario(error.message)
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <h1>Gestión de horarios</h1>
          <p>
            Define los días y rangos horarios en los que el restaurante permite
            realizar reservas.
          </p>
        </div>
      </header>

      <section className="admin-card">
        <h2>Crear nuevo horario</h2>

        <form className="admin-form" onSubmit={handleCrearHorario}>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="dia_semana">Día de la semana</label>
              <select
                id="dia_semana"
                name="dia_semana"
                value={formularioCrear.dia_semana}
                onChange={handleChangeCrear}
              >
                <option value="">Selecciona un día</option>

                {DIAS_SEMANA.map((dia) => (
                  <option key={dia.value} value={dia.value}>
                    {dia.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="hora_inicio">Hora de inicio</label>
              <input
                id="hora_inicio"
                name="hora_inicio"
                type="time"
                value={formularioCrear.hora_inicio}
                onChange={handleChangeCrear}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="hora_fin">Hora de fin</label>
              <input
                id="hora_fin"
                name="hora_fin"
                type="time"
                value={formularioCrear.hora_fin}
                onChange={handleChangeCrear}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="activo">Estado</label>

              <label className="admin-checkbox">
                <input
                  id="activo"
                  name="activo"
                  type="checkbox"
                  checked={formularioCrear.activo}
                  onChange={handleChangeCrear}
                />
                Horario activo
              </label>
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
              {guardando ? 'Guardando...' : 'Crear horario'}
            </button>
          </div>
        </form>
      </section>

      <section className="admin-card">
        <h2>Horarios registrados</h2>

        {cargando && <p>Cargando horarios...</p>}

        {error && (
          <p className="admin-message admin-message--error">{error}</p>
        )}

        {!cargando && !error && horarios.length === 0 && (
          <p>No hay horarios registrados todavía.</p>
        )}

        {!cargando && !error && horarios.length > 0 && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Hora inicio</th>
                  <th>Hora fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {horarios.map((horario) => (
                  <tr key={horario.id}>
                    <td>{obtenerNombreDia(horario.dia_semana)}</td>
                    <td>{formatearHora(horario.hora_inicio)}</td>
                    <td>{formatearHora(horario.hora_fin)}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          horario.activo
                            ? 'status-badge--disponible'
                            : 'status-badge--bloqueada'
                        }`}
                      >
                        {horario.activo ? 'activo' : 'inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-button admin-button--secondary"
                          type="button"
                          onClick={() => abrirModalEditar(horario)}
                        >
                          Editar
                        </button>

                        <button
                          className="admin-button admin-button--ghost"
                          type="button"
                          onClick={() => handleCambiarEstadoHorario(horario)}
                        >
                          {horario.activo ? 'Desactivar' : 'Activar'}
                        </button>

                        <button
                          className="admin-button admin-button--danger"
                          type="button"
                          onClick={() => handleEliminarHorario(horario)}
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
            aria-labelledby="editar-horario-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal__header">
              <div>
                <h2 id="editar-horario-title">Editar horario</h2>
                <p>Modifica el día, el rango horario o el estado.</p>
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
                  <label htmlFor="editar-dia-semana">Día de la semana</label>
                  <select
                    id="editar-dia-semana"
                    name="dia_semana"
                    value={formularioEditar.dia_semana}
                    onChange={handleChangeEditar}
                  >
                    <option value="">Selecciona un día</option>

                    {DIAS_SEMANA.map((dia) => (
                      <option key={dia.value} value={dia.value}>
                        {dia.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-field">
                  <label htmlFor="editar-hora-inicio">Hora de inicio</label>
                  <input
                    id="editar-hora-inicio"
                    name="hora_inicio"
                    type="time"
                    value={formularioEditar.hora_inicio}
                    onChange={handleChangeEditar}
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="editar-hora-fin">Hora de fin</label>
                  <input
                    id="editar-hora-fin"
                    name="hora_fin"
                    type="time"
                    value={formularioEditar.hora_fin}
                    onChange={handleChangeEditar}
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="editar-activo">Estado</label>

                  <label className="admin-checkbox">
                    <input
                      id="editar-activo"
                      name="activo"
                      type="checkbox"
                      checked={formularioEditar.activo}
                      onChange={handleChangeEditar}
                    />
                    Horario activo
                  </label>
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

export default HorariosPage