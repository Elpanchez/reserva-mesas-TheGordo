import { useState } from 'react'
import TableCard from '../../components/client/TableCard'
import { useMesas } from '../../hooks/useMesas'

function HomePage() {
  const { mesas } = useMesas()

  const [mesaSeleccionada, setMesaSeleccionada] = useState(null)

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
              🍽️
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
                seleccionada={mesaSeleccionada?.id === mesa.id}
                onSelect={setMesaSeleccionada}
              />
            ))}
          </div>
        </section>
      </div>

      {/* RIGHT SIDEBAR */}
      <aside className="reservation-sidebar">
        <div className="reservation-form">
          <div className="reservation-icon">
            📅
          </div>

          <h2>Tu reserva</h2>

          <p>
            Completa los datos para reservar la mesa seleccionada
          </p>

          {mesaSeleccionada ? (
            <>
              <div className="selected-table">
                <div>
                  <span>Mesa seleccionada</span>

                  <h3>#{mesaSeleccionada.numero}</h3>
                </div>

                <div className="selected-status">
                  Disponible
                </div>
              </div>

              <div className="form-group">
                <label>Número de personas</label>

                <select>
                  <option>1 persona</option>
                  <option>2 personas</option>
                  <option>3 personas</option>
                  <option>4 personas</option>
                  <option>5 personas</option>
                  <option>6 personas</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fecha</label>
                <input type="date" />
              </div>

              <div className="form-group">
                <label>Hora</label>
                <input type="time" />
              </div>

              <div className="form-divider"></div>

              <div className="form-group">
                <label>Nombre completo</label>

                <input
                  type="text"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>

                <input
                  type="text"
                  placeholder="Tu teléfono"
                />
              </div>

              <div className="form-group">
                <label>Correo electrónico</label>

                <input
                  type="email"
                  placeholder="correo@email.com"
                />
              </div>

              <button className="confirm-button">
                Confirmar reserva
              </button>
            </>
          ) : (
            <div className="empty-selection">
              Selecciona una mesa para comenzar tu reserva
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default HomePage