import type { Player } from "@rahoot/common/types/game"
import type { StatusDataMap } from "@rahoot/common/types/game/status"
import type { ManagerConfig } from "@rahoot/common/types/manager"
import {
  createStatus,
  type Status,
} from "@rahoot/web/features/game/utils/createStatus"
import { create } from "zustand"

type ManagerStore<T> = {
  config: ManagerConfig | null

  gameId: string | null
  status: Status<T> | null
  players: Player[]

  setConfig: (_config: ManagerConfig) => void
  setGameId: (_gameId: string | null) => void
  setStatus: <K extends keyof T>(_name: K, _data: T[K]) => void
  resetStatus: () => void
  setPlayers: (_players: Player[]) => void

  reset: () => void
}

const initialState = {
  config: null,
  gameId: null,
  status: null,
  players: [],
}

export const useManagerStore = create<ManagerStore<StatusDataMap>>((set) => ({
  ...initialState,

  setConfig: (config) => set({ config }),

  setGameId: (gameId) => set({ gameId }),

  setStatus: (name, data) => set({ status: createStatus(name, data) }),
  resetStatus: () => set({ status: null }),

  setPlayers: (players) => set({ players }),

  reset: () => set(initialState),
}))
