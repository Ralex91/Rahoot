import { io } from "socket.io-client"
import { createContext, useContext, useState } from "react"
import { WEBSOCKET_URL } from "@/constants"

export const socket = io("http://localhost:5157", {
  path: "/ws/",
  //addTrailingSlash: false,
  transports: ["websocket"],
})

export const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export function useSocketContext() {
  const context = useContext(SocketContext)
  const [isConnected, setIsConnected] = useState(false)

  return { socket: context }
}
