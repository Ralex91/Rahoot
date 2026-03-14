import {
  SocketProvider,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { useEffect } from "react"
import { Outlet } from "react-router"

const GameLayoutWrapped = () => {
  const { isConnected, connect } = useSocket()
  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  useEffect(() => {
    document.body.classList.add("bg-secondary")

    return () => {
      document.body.classList.remove("bg-secondary")
    }
  }, [])

  return (
    <div className="antialiased bg-secondary">
      <Outlet />
    </div>
  )
}

export const GameLayout = () => (
  <SocketProvider>
    <GameLayoutWrapped />
  </SocketProvider>
)
