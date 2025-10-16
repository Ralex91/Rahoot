import { StatusDataMap } from "@rahoot/common/types/game/status"
import { create } from "zustand"

export type Status<T> = {
  [K in keyof T]: { name: K; data: T[K] }
}[keyof T]

export function createStatus<T, K extends keyof T>(
  name: K,
  data: T[K],
): Status<T> {
  return { name, data }
}

type GameStore<T> = {
  status: Status<T>
  // eslint-disable-next-line no-unused-vars
  setStatus: <K extends keyof T>(name: K, data: T[K]) => void
  resetStatus: () => void
}

export const usePlayerGameStore = create<GameStore<StatusDataMap>>((set) => {
  const initialStatus = createStatus<StatusDataMap, "WAIT">("WAIT", {
    text: "Waiting for the players",
  })

  return {
    status: initialStatus,
    setStatus: (name, data) => set({ status: createStatus(name, data) }),
    resetStatus: () => set({ status: initialStatus }),
  }
})

export const useManagerGameStore = create<GameStore<StatusDataMap>>((set) => {
  const initialStatus = createStatus<StatusDataMap, "SHOW_ROOM">("SHOW_ROOM", {
    text: "Waiting for the players",
  })

  return {
    status: initialStatus,
    setStatus: (name, data) => set({ status: createStatus(name, data) }),
    resetStatus: () => set({ status: initialStatus }),
  }
})
