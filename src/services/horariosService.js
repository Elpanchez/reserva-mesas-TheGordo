import { supabase } from '../lib/supabaseClient'

export async function obtenerHorarios() {
  const { data, error } = await supabase
    .from('horarios')
    .select('*')
    .order('dia_semana', { ascending: true })
    .order('hora_inicio', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function obtenerHorariosActivos() {
  const { data, error } = await supabase
    .from('horarios')
    .select('*')
    .eq('activo', true)
    .order('dia_semana', { ascending: true })
    .order('hora_inicio', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function crearHorario(horario) {
  const { data, error } = await supabase
    .from('horarios')
    .insert([horario])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function actualizarHorario(id, cambios) {
  const { data, error } = await supabase
    .from('horarios')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function cambiarEstadoHorario(id, activo) {
  const { data, error } = await supabase
    .from('horarios')
    .update({ activo })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function eliminarHorario(id) {
  const { error } = await supabase
    .from('horarios')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return true
}