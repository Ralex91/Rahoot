const convertTimeToPoint = (startTime, secondes) => {
  let points = 1000

  const actualTime = Date.now()
  const tempsPasseEnSecondes = (actualTime - startTime) / 1000

  points -= (1000 / secondes) * tempsPasseEnSecondes
  points = Math.max(0, points)

  return points
}

export default convertTimeToPoint
