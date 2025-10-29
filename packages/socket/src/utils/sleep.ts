export const sleep = (sec: number) =>
  new Promise((r) => void setTimeout(r, sec * 1000))

export default sleep
