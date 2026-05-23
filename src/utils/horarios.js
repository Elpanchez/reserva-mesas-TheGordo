export const sumarMinutos = ( hora, minutos ) => {
  const [h, m] = hora.split(':').map(Number)

  const fecha = new Date()

  fecha.setHours(h)
  fecha.setMinutes(m + minutos)

  return fecha.toTimeString().slice(0, 5)
}

export const horaEnRango = ( hora, inicio,fin ) => {
  const convertirMinutos = (h) => {
    const [horas, minutos] = h
      .split(':')
      .map(Number)

    return horas * 60 + minutos
  }

  const actual = convertirMinutos(hora)
  const inicioRango = convertirMinutos(inicio)
  const finRango = convertirMinutos(fin)

  return ( actual >= inicioRango && actual < finRango )
}