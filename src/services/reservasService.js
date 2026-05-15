import { supabase } from '../lib/supabaseClient'
import { ESTADOS_RESERVA } from '../utils/constants'

export async function obtenerReservas() {
  const { data, error } = await supabase
    .from('reservas')
    .select(`
      *,
      mesas (
        id,
        numero,
        capacidad,
        ubicacion,
        estado
      )
    `)
    .order('fecha', { ascending: true })
    .order('hora', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function obtenerReservasPorFecha(fecha) {
  const { data, error } = await supabase
    .from('reservas')
    .select(`
      *,
      mesas (
        id,
        numero,
        capacidad,
        ubicacion,
        estado
      )
    `)
    .eq('fecha', fecha)
    .order('hora', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function obtenerReservasActivasPorFecha(fecha) {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('fecha', fecha)
    .eq('estado', ESTADOS_RESERVA.ACTIVA)
    .order('hora', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function validarDisponibilidadMesa(mesaId, fecha, hora) {
  const { data, error } = await supabase
    .from('reservas')
    .select('id')
    .eq('mesa_id', mesaId)
    .eq('fecha', fecha)
    .eq('hora', hora)
    .eq('estado', ESTADOS_RESERVA.ACTIVA)

  if (error) {
    throw new Error(error.message)
  }

  return data.length === 0
}

export async function crearReserva(reserva) {
  const estaDisponible = await validarDisponibilidadMesa(
    reserva.mesa_id,
    reserva.fecha,
    reserva.hora
  )

  if (!estaDisponible) {
    throw new Error('La mesa ya se encuentra reservada para la fecha y hora seleccionadas.')
  }

  const { data, error } = await supabase
    .from('reservas')
    .insert([
      {
        ...reserva,
        estado: ESTADOS_RESERVA.ACTIVA,
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function cambiarEstadoReserva(id, estado) {
  const { data, error } = await supabase
    .from('reservas')
    .update({ estado })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function cancelarReserva(id) {
  return cambiarEstadoReserva(id, ESTADOS_RESERVA.CANCELADA)
}

export async function completarReserva(id) {
  return cambiarEstadoReserva(id, ESTADOS_RESERVA.COMPLETADA)
}