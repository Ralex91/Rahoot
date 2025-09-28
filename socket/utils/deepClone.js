const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone)
  }

  const clonedObj = {}
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }

  return clonedObj
}

export default deepClone
