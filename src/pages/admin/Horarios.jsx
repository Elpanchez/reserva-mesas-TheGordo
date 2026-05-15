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

  const [formulario, setFormulario] = useState(estadoInicialFormulario)
  const [horarioEditandoId, setHorarioEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [errorFormulario, setErrorFormulario] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const estaEditando = Boolean(horarioEditandoId)

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function limpiarFormulario() {
    setFormulario(estadoInicialFormulario)
    setHorarioEditandoId(null)
    setErrorFormulario(null)
  }

  function validarFormulario() {
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

  async function handleSubmit(event) {
    event.preventDefault()

    const errorValidacion = validarFormulario()

    if (errorValidacion) {
      setErrorFormulario(errorValidacion)
      return
    }

    const horario = {
      dia_semana: Number(formulario.dia_semana),
      hora_inicio: formulario.hora_inicio,
      hora_fin: formulario.hora_fin,
      activo: formulario.activo,
    }

    try {
      setGuardando(true)
      setMensaje(null)
      setErrorFormulario(null)

      if (estaEditando) {
        await editarHorario(horarioEditandoId, horario)
        setMensaje('Horario actualizado correctamente.')
      } else {
        await agregarHorario(horario)
        setMensaje('Horario creado correctamente.')
      }

      limpiarFormulario()
    } catch (error) {
      setErrorFormulario(error.message)
    } finally {
      setGuardando(false)
    }
  }

  function cargarHorarioParaEditar(horario) {
    setHorarioEditandoId(horario.id)

    setFormulario({
      dia_semana: String(horario.dia_semana),
      hora_inicio: formatearHora(horario.hora_inicio),
      hora_fin: formatearHora(horario.hora_fin),
      activo: horario.activo,
    })

    setMensaje(null)
    setErrorFormulario(null)
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

      if (horarioEditandoId === horario.id) {
        limpiarFormulario()
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
        <h2>{estaEditando ? 'Editar horario' : 'Crear nuevo horario'}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="dia_semana">Día de la semana</label>
              <select
                id="dia_semana"
                name="dia_semana"
                value={formulario.dia_semana}
                onChange={handleChange}
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
                value={formulario.hora_inicio}
                onChange={handleChange}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="hora_fin">Hora de fin</label>
              <input
                id="hora_fin"
                name="hora_fin"
                type="time"
                value={formulario.hora_fin}
                onChange={handleChange}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="activo">Estado</label>

              <label className="admin-checkbox">
                <input
                  id="activo"
                  name="activo"
                  type="checkbox"
                  checked={formulario.activo}
                  onChange={handleChange}
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
              {guardando
                ? 'Guardando...'
                : estaEditando
                  ? 'Guardar cambios'
                  : 'Crear horario'}
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
                          onClick={() => cargarHorarioParaEditar(horario)}
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
    </div>
  )
}

export default HorariosPage