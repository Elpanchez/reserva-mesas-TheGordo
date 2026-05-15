import { useCallback, useEffect, useState } from 'react'
import {
  obtenerHorarios,
  obtenerHorariosActivos,
  crearHorario,
  actualizarHorario,
  cambiarEstadoHorario,
  eliminarHorario,
} from '../services/horariosService'

export function useHorarios(cargarAlIniciar = true) {
  const [horarios, setHorarios] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const cargarHorarios = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const data = await obtenerHorarios()
      setHorarios(data)

      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarHorariosActivos = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const data = await obtenerHorariosActivos()
      setHorarios(data)

      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setCargando(false)
    }
  }, [])

  const agregarHorario = async (horario) => {
    try {
      setError(null)

      const nuevoHorario = await crearHorario(horario)
      setHorarios((horariosActuales) => [...horariosActuales, nuevoHorario])

      return nuevoHorario
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const editarHorario = async (id, cambios) => {
    try {
      setError(null)

      const horarioActualizado = await actualizarHorario(id, cambios)

      setHorarios((horariosActuales) =>
        horariosActuales.map((horario) =>
          horario.id === id ? horarioActualizado : horario
        )
      )

      return horarioActualizado
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const cambiarEstado = async (id, activo) => {
    try {
      setError(null)

      const horarioActualizado = await cambiarEstadoHorario(id, activo)

      setHorarios((horariosActuales) =>
        horariosActuales.map((horario) =>
          horario.id === id ? horarioActualizado : horario
        )
      )

      return horarioActualizado
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const eliminar = async (id) => {
    try {
      setError(null)

      await eliminarHorario(id)

      setHorarios((horariosActuales) =>
        horariosActuales.filter((horario) => horario.id !== id)
      )

      return true
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  useEffect(() => {
    if (cargarAlIniciar) {
      cargarHorarios()
    }
  }, [cargarAlIniciar, cargarHorarios])

  return {
    horarios,
    cargando,
    error,
    cargarHorarios,
    cargarHorariosActivos,
    agregarHorario,
    editarHorario,
    cambiarEstado,
    eliminar,
  }
}