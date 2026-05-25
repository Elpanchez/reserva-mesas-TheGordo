import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useReservas } from '../../hooks/useReservas'
import { obtenerHorarioPorDia } from '../../services/horariosService'
import { obtenerHorasOcupadas, horaDisponible } from '../../services/disponibilidadService'
import { ESTADOS_RESERVA } from '../../utils/constants'

function ReservationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const mesa = location.state?.mesa

  const [formData, setFormData] = useState({
    personas: '1',
    fecha: '',
    hora: '',
    nombre: '',
    telefono: '',
    email: '',
  })

  const [enviando, setEnviando] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState(null)
  const [horasDisponibles, setHorasDisponibles] = useState([])

  const { agregarReserva } = useReservas()

  useEffect(() => {
  const cargarHorarios = async () => {
    if (!formData.fecha || !mesa) return

    try {
      const fecha = new Date(`${formData.fecha}T00:00:00`)
      const diaSemana = fecha.getDay()

      const horario = await obtenerHorarioPorDia(diaSemana)

      if (!horario) {
        setHorasDisponibles([])
        return
      }

      const reservasOcupadas =
        await obtenerHorasOcupadas(
          mesa.id,
          formData.fecha
        )

      const horas = []

      let actual = horario.hora_inicio.slice(0, 5)
      let fin = horario.hora_fin.slice(0, 5)

      while (actual < fin) {
        let disponible = horaDisponible(
          actual,
          reservasOcupadas
        )

        const hoy = new Date()
        const fechaSeleccionada = new Date(
          formData.fecha + 'T00:00:00'
        )

        const mismaFecha =
          hoy.toDateString() ===
          fechaSeleccionada.toDateString()

        if (mismaFecha) {
          const [h, m] = actual
            .split(':')
            .map(Number)

          const horaReserva = new Date()

          horaReserva.setHours(h)
          horaReserva.setMinutes(m)

          const diferencia =
            horaReserva.getTime() -
            hoy.getTime()

          const unaHora = 60 * 60 * 1000

          if (diferencia < unaHora) {
            disponible = false
          }
        }

        horas.push({
          value: actual,
          label: actual,
          disponible
        })

        const [h, m] = actual
          .split(':')
          .map(Number)

        const fechaTemp = new Date()

        fechaTemp.setHours(h)
        fechaTemp.setMinutes(m + 30)

        actual = fechaTemp
          .toTimeString()
          .slice(0, 5)
      }

      setHorasDisponibles(horas)
    } catch (error) {
      console.error(
        'Error cargando horarios:',
        error
      )
    }
  }

  cargarHorarios()
}, [formData.fecha, mesa])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setErrorSubmit(null)

    if (parseInt(formData.personas) > mesa.capacidad) {
  setErrorSubmit(
    `La mesa seleccionada solo permite ${mesa.capacidad} personas`
  )
  setEnviando(false)
  return
}

        const horaValida = horasDisponibles.find((h) => h.value === formData.hora && h.disponible)

    if (!horaValida) {
      setErrorSubmit('La hora seleccionada ya no está disponible')

      setEnviando(false)
      return
    }

    try {
      const nuevaReserva = await agregarReserva({
        mesa_id: mesa.id,
        fecha: formData.fecha,
        hora: formData.hora,
        num_personas: parseInt(formData.personas),
        cliente_nombre: formData.nombre,
        cliente_tel: formData.telefono,
        cliente_email: formData.email,
      })

      navigate('/reserva-exitosa', {
        state: {
          mesa,
          ...formData,
          reservaId: nuevaReserva.id
        }
      })
    } catch (error) {
      setErrorSubmit(error.message || 'Hubo un error al procesar tu reserva')
      setEnviando(false)
    }
  }

  if (!mesa) {
    return (
      <div className="reservation-page-full">
        <div className="page-back-button">
          <button
            className="back-button"
            onClick={() => navigate('/')}
          >
            ← Volver
          </button>
        </div>
        <div className="page-content-centered">
          <section className="error-section">
            <p>Por favor, selecciona una mesa primero.</p>
            <button
              className="secondary-button"
              onClick={() => navigate('/')}
            >
              Ir al catálogo
            </button>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="reservation-page-full">
      <div className="page-back-button">
        <button
          className="back-button"
          onClick={() => navigate('/')}
          disabled={enviando}
        >
          ← Volver
        </button>
      </div>

      <div className="page-content-centered">
        <section className="reservation-form-section">
          <div className="form-header">
            <h1>Completa tu reserva</h1>
            <p>Mesa seleccionada: #{mesa.numero}</p>
          </div>

          {errorSubmit && (
            <div className="form-error-message">
              {errorSubmit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="reservation-form-centered">
            <div className="selected-table">
              <div>
                <span>Mesa seleccionada</span>
                <h3>#{mesa.numero}</h3>
              </div>
              <div className="selected-status">
                Mesa Seleccionada
              </div>
            </div>

            <div className="form-group">
              <label>Número de personas</label>
              <select
                name="personas"
                value={formData.personas}
                onChange={handleChange}
                disabled={enviando}
              >
                <option value="1">1 persona</option>
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4 personas</option>
                <option value="5">5 personas</option>
                <option value="6">6 personas</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                disabled={enviando}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Hora</label>
              <select
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
              >
                <option value="">
                  Selecciona una hora
                </option>

                {horasDisponibles.map((hora) => (
                  <option
                    key={hora.value}
                    value={hora.value}
                    disabled={!hora.disponible}
                  >
                    {hora.label}
                    {!hora.disponible
                      ? ' - Ocupada'
                      : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-divider"></div>

            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                  onChange={(e) => { const valor = e.target.value
                  if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor)) {
                    handleChange(e)
                  }
                }}
                disabled={enviando}
                maxLength={50} 
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                placeholder="Tu teléfono"
                value={formData.telefono}
                  onChange={(e) => { const valor = e.target.value
                  if (/^\d*$/.test(valor) && valor.length <= 10) {
                    handleChange(e)
                  }
                }}
                disabled={enviando}
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="correo@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={enviando}
                required
              />
            </div>

            <button
              type="submit"
              className="confirm-button"
              disabled={enviando}
            >
              {enviando ? 'Procesando...' : 'Confirmar reserva'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default ReservationPage