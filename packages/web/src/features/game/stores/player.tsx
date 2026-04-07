import type { StatusDataMap } from "@rahoot/common/types/game/status";

import {
  createStatus,
  type Status,
} from "@rahoot/web/features/game/utils/createStatus";

import { create } from "zustand";

type PlayerState = {
  username?: string;

  points?: number;

  avatar?: string;
  token?: string | null;
};

type PlayerStore<T> = {
  gameId: string | null;
  player: PlayerState | null;
  status: Status<T> | null;

  setGameId: (_gameId: string | null) => void;

  setPlayer: (_state: PlayerState) => void;
  login: (
    _username: string,
    _avatar?: string,
    _token?: string | null,
  ) => void;
  join: (
    _gameId: string,
    _avatar?: string,
    _token?: string | null,
  ) => void;
  updatePoints: (_points: number) => void;

  setStatus: <K extends keyof T>(_name: K, _data: T[K]) => void;

  reset: () => void;
};

const initialState = {
  gameId: null,
  player: null,
  status: null,
};

export const usePlayerStore = create<PlayerStore<StatusDataMap>>((set) => ({
  ...initialState,

  setGameId: (gameId) => set({ gameId }),

  setPlayer: (player: PlayerState) => set({ player }),

  login: (username, avatar?: string, token?: string | null) =>
    set((state) => ({
      player: { ...state.player, username, avatar, token },
    })),

  join: (gameId, avatar?: string, token?: string | null) => {
    set((state) => ({
      gameId,

      player: { ...state.player, points: 0, avatar, token },
    }));
  },

  updatePoints: (points) =>
    set((state) => ({
      player: { ...state.player, points },
    })),

  setStatus: (name, data) => set({ status: createStatus(name, data) }),

  reset: () => set(initialState),
}));
