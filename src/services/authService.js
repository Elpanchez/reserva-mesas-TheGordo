import { supabase } from '../lib/supabaseClient'

export async function iniciarSesion(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function obtenerSesionActual() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw new Error(error.message)
  }

  return data.session
}

export async function obtenerUsuarioActual() {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  return data.user
}