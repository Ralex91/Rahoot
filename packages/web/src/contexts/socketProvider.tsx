/* eslint-disable no-empty-function */
"use client"
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@rahoot/common/types/game/socket"
import ky from "ky"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { io, Socket } from "socket.io-client"

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

interface SocketContextValue {
  socket: TypedSocket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  reconnect: () => void
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  reconnect: () => {},
})

const getSocketServer = async () => {
  const res = await ky.get("/socket").json<{ url: string }>()

  return res.url
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<TypedSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let s: TypedSocket | null = null

    const initSocket = async () => {
      try {
        const socketUrl = await getSocketServer()

        s = io(socketUrl, {
          transports: ["websocket"],
          autoConnect: false,
        })

        setSocket(s)

        s.on("connect", () => {
          setIsConnected(true)
        })

        s.on("disconnect", () => {
          console.log("Socket disconnected")
          setIsConnected(false)
        })

        s.on("connect_error", (err) => {
          console.error("Connection error:", err.message)
        })
      } catch (error) {
        console.error("Failed to initialize socket:", error)
      }
    }

    initSocket()

    return () => {
      s?.disconnect()
    }
  }, [])

  const connect = useCallback(() => {
    if (socket && !socket.connected) {
      console.log("🔌 Manual connect")
      socket.connect()
    }
  }, [socket])

  const disconnect = useCallback(() => {
    if (socket && socket.connected) {
      console.log("🧹 Manual disconnect")
      socket.disconnect()
    }
  }, [socket])

  const reconnect = useCallback(() => {
    if (socket) {
      console.log("♻️ Manual reconnect")
      socket.disconnect()
      socket.connect()
    }
  }, [socket])

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
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
    if (!socket) {
      return
    }

    socket.on(event, callback as any)

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off(event, callback as any)
    }
  }, [socket, event, callback])
}
