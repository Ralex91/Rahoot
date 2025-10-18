/* eslint-disable no-unused-vars */
import { StatusDataMap } from "@rahoot/common/types/game/status"
import { createStatus, Status } from "@rahoot/web/utils/createStatus"
import { create } from "zustand"

type PlayerState = {
  username?: string
  points?: number
}

type PlayerStore<T> = {
  gameId: string | null
  player: PlayerState | null
  status: Status<T>

  setGameId: (gameId: string | null) => void

  setPlayer: (state: PlayerState) => void
  login: (gameId: string) => void
  join: (username: string) => void
  updatePoints: (points: number) => void
  logout: () => void

  setStatus: <K extends keyof T>(name: K, data: T[K]) => void
  resetStatus: () => void
}

const initialStatus = createStatus<StatusDataMap, "WAIT">("WAIT", {
  text: "Waiting for the players",
})

export const usePlayerStore = create<PlayerStore<StatusDataMap>>((set) => ({
  gameId: null,
  player: null,
  status: initialStatus,
  currentQuestion: null,

  setGameId: (gameId) => set({ gameId }),

  setPlayer: (player: PlayerState) => set({ player }),
  login: (username) =>
    set((state) => ({
      player: { ...state.player, username },
    })),

  join: (gameId) => {
    set((state) => ({
      gameId,
      player: { ...state.player, points: 0 },
    }))
  },

  updatePoints: (points) =>
    set((state) => ({
      player: { ...state.player, points },
    })),

  logout: () => set({ player: null }),

  setStatus: (name, data) => set({ status: createStatus(name, data) }),
  resetStatus: () => set({ status: initialStatus }),
}))
