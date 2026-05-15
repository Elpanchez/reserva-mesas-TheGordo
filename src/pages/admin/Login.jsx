import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function LoginPage() {
  const navigate = useNavigate()
  const { login, estaAutenticado } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setError(null)
      setCargando(true)

      await login(email, password)

      navigate('/admin')
    } catch (error) {
      console.error(error)
      setError('Correo o contraseña incorrectos.')
    } finally {
      setCargando(false)
    }
  }

  if (estaAutenticado) {
    navigate('/admin')
  }

  return (
    <section>
      <h1>Inicio de sesión</h1>
      <p>Acceso exclusivo para administradores.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="admin@thegordo.com"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Ingresa tu contraseña"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </section>
  )
}

export default LoginPage