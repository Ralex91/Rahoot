export type Status<T> = {
  [K in keyof T]: { name: K; data: T[K] }
}[keyof T]

export const createStatus = <T, K extends keyof T>(
  name: K,
  data: T[K],
): Status<T> => ({ name, data })
