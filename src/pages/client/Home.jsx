import { useEffect, useState } from 'react'
import { obtenerMesas } from '../../services/mesasService'

function HomePage() {
  const [mesas, setMesas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargarMesas() {
      try {
        const data = await obtenerMesas()
        console.log('Mesas desde Supabase:', data)
        setMesas(data)
      } catch (error) {
        console.error(error)
        setError(error.message)
      } finally {
        setCargando(false)
      }
    }

    cargarMesas()
  }, [])

  return (
    <section>
      <h1>Comidas Rápidas The Gordo</h1>
      <p>Vista del salón y disponibilidad de mesas.</p>

      {cargando && <p>Cargando mesas...</p>}

      {error && <p>Error: {error}</p>}

      {!cargando && !error && (
        <p>Mesas cargadas desde Supabase: {mesas.length}</p>
      )}
    </section>
  )
}

export default HomePage