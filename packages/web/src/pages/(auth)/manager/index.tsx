import { EVENTS } from "@razzia/common/constants"
import {
  useEvent,
  useSocket,
} from "@razzia/web/features/game/contexts/socket-context"
import { useManagerStore } from "@razzia/web/features/game/stores/manager"
import ManagerPassword from "@razzia/web/features/manager/components/ManagerPassword"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

const ManagerAuthPage = () => {
  const { setConfig } = useManagerStore()
  const navigate = useNavigate()
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!isConnected) {
      return
    }

    socket.emit(EVENTS.MANAGER.GET_CONFIG)
    // oxlint-disable-next-line
  }, [isConnected])

  useEvent(EVENTS.MANAGER.CONFIG, (data) => {
    setConfig(data)
    navigate({ to: "/manager/config" })
  })

  const handleAuth = (password: string) => {
    socket.emit(EVENTS.MANAGER.AUTH, password)
  }

  return <ManagerPassword onSubmit={handleAuth} />
}

export const Route = createFileRoute("/(auth)/manager/")({
  component: ManagerAuthPage,
})
