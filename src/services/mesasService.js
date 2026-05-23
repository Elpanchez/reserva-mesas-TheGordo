import { supabase } from '../lib/supabaseClient'
import { ESTADOS_MESA } from '../utils/constants'

export async function obtenerMesas() {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .order('numero', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function obtenerMesasDisponibles() {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .eq('estado', ESTADOS_MESA.DISPONIBLE)
    .order('numero', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function obtenerMesaPorId(id) {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function crearMesa(mesa) {
  const { data, error } = await supabase
    .from('mesas')
    .insert([mesa])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function actualizarMesa(id, cambios) {
  const { data, error } = await supabase
    .from('mesas')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function cambiarEstadoMesa(id, estado) {
  const { data, error } = await supabase
    .from('mesas')
    .update({ estado })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function bloquearMesa(id) {
  return cambiarEstadoMesa(id, ESTADOS_MESA.BLOQUEADA)
}

export async function desbloquearMesa(id) {
  return cambiarEstadoMesa(id, ESTADOS_MESA.DISPONIBLE)
}

export async function eliminarMesa(id) {
  const { error } = await supabase
    .from('mesas')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const actualizarEstadoMesa = async (mesaId, estado) => {
  const { data, error } = await supabase
    .from('mesas')
    .update({
      estado,
      updated_at: new Date().toISOString()
    })
    .eq('id', mesaId)
    .select()
    .single()

  if (error) {
    console.error('Error actualizando estado mesa:', error)
    throw error
  }

  return data
}