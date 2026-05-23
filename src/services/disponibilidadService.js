import { supabase } from '../lib/supabaseClient'
import { sumarMinutos, horaEnRango } from '../utils/horarios'

export const obtenerHorasOcupadas = async ( mesaId, fecha ) => {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .eq('mesa_id', mesaId)
    .eq('fecha', fecha)
    .eq('estado', 'activa')

  if (error) {
    throw error
  }

  return data.map((reserva) => {
    const inicio = reserva.hora.slice(0, 5)

    const fin = sumarMinutos( inicio, reserva.duracion_minutos || 90 )
    return { inicio, fin }
  })
}

export const horaDisponible = ( hora, horariosOcupados ) => {
  return !horariosOcupados.some(
    ({ inicio, fin }) => horaEnRango(hora, inicio, fin)
  )
}