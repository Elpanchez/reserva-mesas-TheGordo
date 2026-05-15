import { useCallback, useEffect, useState } from 'react'
import {
  obtenerMesas,
  obtenerMesasDisponibles,
  crearMesa,
  actualizarMesa,
  cambiarEstadoMesa,
  bloquearMesa,
  desbloquearMesa,
  eliminarMesa,
} from '../services/mesasService'

export function useMesas(cargarAlIniciar = true) {
  const [mesas, setMesas] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const cargarMesas = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const data = await obtenerMesas()
      setMesas(data)

      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarMesasDisponibles = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const data = await obtenerMesasDisponibles()
      setMesas(data)

      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setCargando(false)
    }
  }, [])

  const agregarMesa = async (mesa) => {
    try {
      setError(null)

      const nuevaMesa = await crearMesa(mesa)
      setMesas((mesasActuales) => [...mesasActuales, nuevaMesa])

      return nuevaMesa
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const editarMesa = async (id, cambios) => {
    try {
      setError(null)

      const mesaActualizada = await actualizarMesa(id, cambios)

      setMesas((mesasActuales) =>
        mesasActuales.map((mesa) =>
          mesa.id === id ? mesaActualizada : mesa
        )
      )

      return mesaActualizada
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const actualizarEstadoMesa = async (id, estado) => {
    try {
      setError(null)

      const mesaActualizada = await cambiarEstadoMesa(id, estado)

      setMesas((mesasActuales) =>
        mesasActuales.map((mesa) =>
          mesa.id === id ? mesaActualizada : mesa
        )
      )

      return mesaActualizada
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const bloquear = async (id) => {
    try {
      setError(null)

      const mesaActualizada = await bloquearMesa(id)

      setMesas((mesasActuales) =>
        mesasActuales.map((mesa) =>
          mesa.id === id ? mesaActualizada : mesa
        )
      )

      return mesaActualizada
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const desbloquear = async (id) => {
    try {
      setError(null)

      const mesaActualizada = await desbloquearMesa(id)

      setMesas((mesasActuales) =>
        mesasActuales.map((mesa) =>
          mesa.id === id ? mesaActualizada : mesa
        )
      )

      return mesaActualizada
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const eliminar = async (id) => {
    try {
      setError(null)

      await eliminarMesa(id)

      setMesas((mesasActuales) =>
        mesasActuales.filter((mesa) => mesa.id !== id)
      )

      return true
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  useEffect(() => {
    if (cargarAlIniciar) {
      cargarMesas()
    }
  }, [cargarAlIniciar, cargarMesas])

  return {
    mesas,
    cargando,
    error,
    cargarMesas,
    cargarMesasDisponibles,
    agregarMesa,
    editarMesa,
    actualizarEstadoMesa,
    bloquear,
    desbloquear,
    eliminar,
  }
}