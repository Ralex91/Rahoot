export const calculatePercentages = (
  objectResponses: Record<string, number>,
): Record<string, string> => {
  const keys = Object.keys(objectResponses)
  const values = Object.values(objectResponses)

  if (!values.length) {
    return {}
  }

  const totalSum = values.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  )

  const result: Record<string, string> = {}

  keys.forEach((key) => {
    result[key] = `${((objectResponses[key] / totalSum) * 100).toFixed()}%`
  })

  return result
}
