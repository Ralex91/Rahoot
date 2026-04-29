/* eslint-disable no-empty-function */

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@rahoot/common/types/game/socket"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { io, Socket } from "socket.io-client"
import { v7 as uuid } from "uuid"

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

interface SocketContextValue {
  socket: TypedSocket
  isConnected: boolean
  clientId: string
  connect: () => void
  disconnect: () => void
  reconnect: () => void
}

const getClientId = (): string => {
  try {
    const stored = localStorage.getItem("client_id")

    if (stored) {
      return stored
    }

    const newId = uuid()
    localStorage.setItem("client_id", newId)

    return newId
  } catch {
    return uuid()
  }
}

const clientId = getClientId()

export const socketClient: TypedSocket = io("/", {
  path: "/ws",
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  auth: { clientId },
})

const SocketContext = createContext<SocketContextValue>({
  socket: socketClient,
  isConnected: false,
  clientId,
  connect: () => {},
  disconnect: () => {},
  reconnect: () => {},
})

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    socketClient.on("connect", () => setIsConnected(true))
    socketClient.on("disconnect", () => setIsConnected(false))
    socketClient.on("connect_error", (err) => {
      console.error("Connection error:", err.message)
    })

    return () => {
      socketClient.disconnect()
    }
  }, [])

  const connect = useCallback(() => {
    if (!socketClient.connected) {
      socketClient.connect()
    }
  }, [])

  const disconnect = useCallback(() => {
    if (socketClient.connected) {
      socketClient.disconnect()
    }
  }, [])

  const reconnect = useCallback(() => {
    socketClient.disconnect()
    socketClient.connect()
  }, [])

  return (
    <SocketContext.Provider
      value={{
        socket: socketClient,
        isConnected,
        clientId,
        connect,
        disconnect,
        reconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)

export const useEvent = <E extends keyof ServerToClientEvents>(
  event: E,
  callback: ServerToClientEvents[E],
) => {
  const { socket } = useSocket()

  useEffect(() => {
    socket.on(event, callback as any)

    return () => {
      socket.off(event, callback as any)
    }
  }, [socket, event, callback])
}
