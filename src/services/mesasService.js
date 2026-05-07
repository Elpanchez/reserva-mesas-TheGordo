import { supabase } from '../lib/supabaseClient'

export async function obtenerMesas() {
  const { data, error } = await supabase
    .from('mesas')
    .select('*')
    .order('numero', { ascending: true })

  if (error) {
    throw error
  }

  return data
}