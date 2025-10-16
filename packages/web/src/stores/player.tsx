/* eslint-disable no-unused-vars */
import { create } from "zustand"

type PlayerState = {
  gameId?: string
  username?: string
  points?: number
}

type PlayerStore = {
  player: PlayerState | null
  login: (gameId: string) => void
  join: (username: string) => void
  updatePoints: (points: number) => void
  logout: () => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  player: null,

  login: (username) =>
    set((state) => ({
      player: { ...state.player, username },
    })),

  join: (gameId) =>
    set((state) => ({
      player: { ...state.player, gameId, points: 0 },
    })),

  updatePoints: (points) =>
    set((state) => ({
      player: { ...state.player, points },
    })),

  logout: () => set({ player: null }),
}))
