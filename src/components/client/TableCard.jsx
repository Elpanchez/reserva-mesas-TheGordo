import { Users, MapPin } from 'lucide-react'

function TableCard({ mesa, seleccionada, onSelect }) {
  const estadoClase = {
    disponible: 'status--available',
    ocupada: 'status--occupied',
    bloqueada: 'status--blocked',
  }

  const estadoTexto = {
    disponible: 'Disponible',
    ocupada: 'Ocupada',
    bloqueada: 'Bloqueada',
  }

  return (
    <article
      className={`table-card ${
        seleccionada ? 'table-card--selected' : ''
      } ${
        mesa.estado === 'ocupada'
          ? 'table-card--disabled'
          : ''
      }`}
    >
      <div className="table-card__top">
        <div>
          <span className="table-card__label">
            Mesa
          </span>

          <h2>#{mesa.numero}</h2>
        </div>

        <span
          className={`table-card__status ${
            estadoClase[mesa.estado]
          }`}
        >
          {estadoTexto[mesa.estado]}
        </span>
      </div>

      <div className="table-card__content">
        <div className="table-card__info">
          <span className="table-card__info-icon">
            <Users size={16} />
          </span>
          <strong>{mesa.capacidad} personas</strong>
        </div>

        <div className="table-card__info">
          <span className="table-card__info-icon">
            <MapPin size={16} />
          </span>
          <strong>{mesa.ubicacion}</strong>
        </div>
      </div>

      <button
        disabled={mesa.estado !== 'disponible'}
        onClick={() => onSelect(mesa)}
      >
        {mesa.estado === 'disponible'
          ? 'Seleccionar mesa'
          : 'No disponible'}
      </button>
    </article>
  )
}

export default TableCard