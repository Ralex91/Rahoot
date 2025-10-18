/* eslint-disable no-unused-vars */
import { Player } from "@rahoot/common/types/game"
import { StatusDataMap } from "@rahoot/common/types/game/status"
import { createStatus, Status } from "@rahoot/web/utils/createStatus"
import { create } from "zustand"

type ManagerStore<T> = {
  gameId: string | null
  status: Status<T>
  players: Player[]

  setGameId: (gameId: string | null) => void

  setStatus: <K extends keyof T>(name: K, data: T[K]) => void
  resetStatus: () => void

  setPlayers: (players: Player[]) => void
}

const initialStatus = createStatus<StatusDataMap, "SHOW_ROOM">("SHOW_ROOM", {
  text: "Waiting for the players",
})

export const useManagerStore = create<ManagerStore<StatusDataMap>>((set) => ({
  gameId: null,
  status: initialStatus,
  players: [],

  setGameId: (gameId) => set({ gameId }),

  setStatus: (name, data) => set({ status: createStatus(name, data) }),
  resetStatus: () => set({ status: initialStatus }),

  setPlayers: (players) => set({ players }),
}))
