import { useState, useEffect } from 'react'
import {obtenerMesas} from './services/mesasService'
import './App.css'

function App() {
  const [mesas, setMesas] = useState([])
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarMesas() {
      try {
        const data = await obtenerMesas()
        console.log('Mesas desde Supabase:', data)
        setMesas(data)
      } catch (error) {
        console.error('Error conectando con Supabase:', error.message)
        setError(error.message)
      } finally {
        setCargando(false)
      }
    }

    cargarMesas()
  }, [])

  return (
    <main className="app">
      <section className="welcome-card">

        <h1>Sistema de Reservas de Mesas</h1>
        <h2>Comidas Rápidas The Gordo</h2>

        <p>
          Prueba de conexión con supabase, consultando la tabla 'mesas'
        </p>

        {cargando && <p className="status">Cargando mesas...</p>}

        {error && (
          <p className="error">
            Error al conectar con Supabase: {error}
          </p>
        )}

        {!cargando && !error && (
          <>
            <p className="status">
              Mesas cargadas desde Supabase: <strong>{mesas.length}</strong>
            </p>

            <div className="tables-grid">
              {mesas.map((mesa) => (
                <article className="table-card" key={mesa.id}>
                  <h3>Mesa {mesa.numero}</h3>
                  <p>Capacidad: {mesa.capacidad} personas</p>
                  <p>Ubicación: {mesa.ubicacion}</p>
                  <span className={`table-status ${mesa.estado}`}>
                    {mesa.estado}
                  </span>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default App