import { useNavigate } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'
import TableCard from '../../components/client/TableCard'
import { useMesas } from '../../hooks/useMesas'

function HomePage() {
  const { mesas } = useMesas()
  const navigate = useNavigate()

  const handleSelectMesa = (mesa) => {
    navigate('/reservar', { state: { mesa } })
  }

  return (
    <div className="reservation-page">
      <div className="reservation-content">
        <section className="hero-section">
          <div className="hero-badge">
            Sistema de reservas online
          </div>

          <div className="hero-content">
            <div className="hero-text">
              <h1>Reserva tu mesa favorita</h1>

              <p>
                Consulta las mesas disponibles del restaurante y selecciona la
                mejor ubicación para disfrutar tu comida.
              </p>
            </div>

            <div className="hero-illustration">
              <UtensilsCrossed size={160} strokeWidth={1.2} />
            </div>
          </div>
        </section>

        <section className="tables-section">
          <div className="tables-header">
            <h2>Mesas disponibles</h2>

            <p>
              Selecciona una mesa disponible para realizar tu reserva
            </p>
          </div>

          <div className="tables-grid">
            {mesas.map((mesa) => (
              <TableCard
                key={mesa.id}
                mesa={mesa}
                onSelect={handleSelectMesa}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomePage