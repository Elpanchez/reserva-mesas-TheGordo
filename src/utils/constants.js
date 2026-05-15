export const ESTADOS_MESA = {
  DISPONIBLE: 'disponible',
  OCUPADA: 'ocupada',
  BLOQUEADA: 'bloqueada',
}

export const ESTADOS_RESERVA = {
  ACTIVA: 'activa',
  CANCELADA: 'cancelada',
  COMPLETADA: 'completada',
}

export const DIAS_SEMANA = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' },
]

export const RUTAS = {
  HOME: '/',
  RESERVAR: '/reservar',
  RESERVA_EXITOSA: '/reserva-exitosa',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_MESAS: '/admin/mesas',
  ADMIN_RESERVAS: '/admin/reservas',
  ADMIN_HORARIOS: '/admin/horarios',
}