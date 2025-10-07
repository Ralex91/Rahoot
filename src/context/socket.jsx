import { createContext, useContext, useEffect } from "react"
import { io } from "socket.io-client"
import { WEBSOCKET_PUBLIC_URL } from "../../config.mjs"

export const socket = io(WEBSOCKET_PUBLIC_URL, {
  transports: ["websocket"],
})

export const SocketContext = createContext()

//exponential backoff for rejoining
export const SocketContextProvider = ({ children }) => {
  useEffect(() => {
    let attempt = 0
    let timeoutId

    const tryRejoin = () => {
      let token
      try {
        token = localStorage.getItem("rahoot_sessionToken")
      } catch {}

      if (!token) return

      socket.emit("player:rejoin", { sessionToken: token })
      attempt++
      const delay = Math.min(30000, 1000 * Math.pow(2, attempt)) //1,2,4,8... max 30s
      timeoutId = setTimeout(tryRejoin, delay)
    }

    const onConnect = () => {
      attempt = 0
      tryRejoin()
    }

    const onRejoinSuccess = () => {
      if (timeoutId) clearTimeout(timeoutId)
      attempt = 0
    }

    socket.on("connect", onConnect)
    socket.on("game:rejoinSuccess", onRejoinSuccess)

    return () => {
      socket.off("connect", onConnect)
      socket.off("game:rejoinSuccess", onRejoinSuccess)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export function useSocketContext() {
  const context = useContext(SocketContext)

  return { socket: context }
}
