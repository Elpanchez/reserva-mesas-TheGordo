import { useCallback, useEffect, useState } from 'react'
import {
  obtenerReservas,
  obtenerReservasPorFecha,
  obtenerReservasActivasPorFecha,
  validarDisponibilidadMesa,
  crearReserva,
  cancelarReserva,
  completarReserva,
  eliminarReserva,
} from '../services/reservasService'

export function useReservas(cargarAlIniciar = false) {
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const cargarReservas = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)

      const data = await obtenerReservas()
      setReservas(data)

      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarReservasPorFecha = async (fecha) => {
    try {
      setCargando(true)
      setError(null)

      const data = await obtenerReservasPorFecha(fecha)
      setReservas(data)

      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setCargando(false)
    }
  }

  const cargarReservasActivasPorFecha = async (fecha) => {
    try {
      setCargando(true)
      setError(null)

      const data = await obtenerReservasActivasPorFecha(fecha)
      setReservas(data)

      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setCargando(false)
    }
  }

  const validarDisponibilidad = async (mesaId, fecha, hora) => {
    try {
      setError(null)

      return await validarDisponibilidadMesa(mesaId, fecha, hora)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const agregarReserva = async (reserva) => {
    try {
      setCargando(true)
      setError(null)

      const nuevaReserva = await crearReserva(reserva)
      setReservas((reservasActuales) => [...reservasActuales, nuevaReserva])

      return nuevaReserva
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setCargando(false)
    }
  }

  const cancelar = async (id) => {
    try {
      setError(null)

      const reservaActualizada = await cancelarReserva(id)

      setReservas((reservasActuales) =>
        reservasActuales.map((reserva) =>
          reserva.id === id ? reservaActualizada : reserva
        )
      )

      return reservaActualizada
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const completar = async (id) => {
    try {
      setError(null)

      const reservaActualizada = await completarReserva(id)

      setReservas((reservasActuales) =>
        reservasActuales.map((reserva) =>
          reserva.id === id ? reservaActualizada : reserva
        )
      )

      return reservaActualizada
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

const eliminar = async (id) => {
  try {
    setError(null)

    await eliminarReserva(id)

    setReservas((reservasActuales) =>
      reservasActuales.filter((reserva) => reserva.id !== id)
    )

    return true
  } catch (error) {
    setError(error.message)
    throw error
  }
}

  useEffect(() => {
    if (cargarAlIniciar) {
      cargarReservas()
    }
  }, [cargarAlIniciar, cargarReservas])

  return {
    reservas,
    cargando,
    error,
    cargarReservas,
    cargarReservasPorFecha,
    cargarReservasActivasPorFecha,
    validarDisponibilidad,
    agregarReserva,
    cancelar,
    completar,
    eliminar,
  }
}