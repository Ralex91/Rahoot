import { createContext, useContext, useReducer } from "react"

export const PlayerContext = createContext()

export function playerReducer(state, action) {
  switch (action.type) {
    case "JOIN":
      return { player: { ...state.player, room: action.payload } }
    case "LOGIN":
      return {
        player: {
          ...state.player,
          username: action.payload,
          points: 0,
        },
      }
    case "UPDATE":
      return { player: { ...state.player, ...action.payload } }
    case "LOGOUT":
      return { player: null }
    default:
      return state
  }
}

export const PlayerContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, {
    player: null,
  })

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayerContext() {
  const context = useContext(PlayerContext)

  if (!context) {
    throw Error("usePlayerContext must be used inside an PlayerContextProvider")
  }

  return context
}
