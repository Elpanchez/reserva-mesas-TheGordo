import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useReservas } from '../../hooks/useReservas'
import { useMesas } from '../../hooks/useMesas'

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

  const { agregarReserva } = useReservas()
  const { bloquear } = useMesas(false)

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

      await bloquear(mesa.id)

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
                Disponible
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
                required
              />
            </div>

            <div className="form-group">
              <label>Hora</label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                disabled={enviando}
                required
              />
            </div>

            <div className="form-divider"></div>

            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={enviando}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                placeholder="Tu teléfono"
                value={formData.telefono}
                onChange={handleChange}
                disabled={enviando}
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