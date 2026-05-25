import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

function ReservationSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const reservaData = location.state

  if (!reservaData?.mesa) {
    return (
      <div className="reservation-page-full">
        <div className="page-content-centered">
          <section className="error-section">
            <p>Datos de reserva no encontrados.</p>
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

      </div>

      <div className="page-content-centered">
        <section className="success-section">
          <div className="success-icon">
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </div>

          <h1>¡Reserva confirmada!</h1>

          <p>Tu reserva ha sido registrada correctamente.</p>

          <div className="reservation-summary">
            <h2>Detalles de tu reserva</h2>

            <div className="summary-item">
              <span className="label">Mesa:</span>
              <span className="value">#{reservaData.mesa.numero}</span>
            </div>

            <div className="summary-item">
              <span className="label">Personas:</span>
              <span className="value">{reservaData.personas}</span>
            </div>

            <div className="summary-item">
              <span className="label">Fecha:</span>
              <span className="value">{reservaData.fecha}</span>
            </div>

            <div className="summary-item">
              <span className="label">Hora:</span>
              <span className="value">{reservaData.hora}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-item">
              <span className="label">Nombre:</span>
              <span className="value">{reservaData.nombre}</span>
            </div>

            <div className="summary-item">
              <span className="label">Teléfono:</span>
              <span className="value">{reservaData.telefono}</span>
            </div>

            <div className="summary-item">
              <span className="label">Correo:</span>
              <span className="value">{reservaData.email}</span>
            </div>
          </div>

          <div className="success-actions">
            <button
              className="confirm-button"
              onClick={() => navigate('/')}
            >
              Volver al inicio
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ReservationSuccessPage