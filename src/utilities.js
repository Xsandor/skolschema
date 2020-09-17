function timeToMinutes (time) {
  time = time.split(':')
  if (time.length !== 2) {
    return
  }

  const hours = parseInt(time[0])
  const minutes = parseInt(time[1])

  return hours * 60 + minutes
}

function minutesToTime (minutes) {
  const HH = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0')
  const MM = (minutes % 60).toString().padStart(2, '0')

  return `${HH}:${MM}`
}

function calcEventTime (event) {
  return (event.end.getTime() - event.start.getTime()) / (1000 * 60)
}

function formattedTime (date) {
  if (!date) return
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

export { timeToMinutes, minutesToTime, calcEventTime, formattedTime }
