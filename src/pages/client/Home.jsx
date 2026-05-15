import { useMesas } from '../../hooks/useMesas'

function HomePage() {
  const { mesas, cargando, error } = useMesas()

  return (
    <section>
      <h1>Comidas Rápidas The Gordo</h1>
      <p>Vista del salón y disponibilidad de mesas.</p>

      {cargando && <p>Cargando mesas...</p>}

      {error && <p>Error: {error}</p>}

      {!cargando && !error && (
        <>
          <p>Mesas cargadas desde Supabase: {mesas.length}</p>

          <ul>
            {mesas.map((mesa) => (
              <li key={mesa.id}>
                Mesa {mesa.numero} - {mesa.capacidad} personas - {mesa.estado}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default HomePage