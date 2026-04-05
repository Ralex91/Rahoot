import { EVENTS } from "@rahoot/common/constants"
import { STATUS } from "@rahoot/common/types/game/status"
import type { ManagerConfig } from "@rahoot/common/types/manager"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socket-context"
import { useManagerStore } from "@rahoot/web/features/game/stores/manager"
import Configurations from "@rahoot/web/features/manager/components/configurations"
import ManagerPassword from "@rahoot/web/features/manager/components/ManagerPassword"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"

const ManagerAuthPage = () => {
  const { setGameId, setStatus } = useManagerStore()
  const navigate = useNavigate()
  const { socket } = useSocket()

  const [isAuth, setIsAuth] = useState(false)
  const [config, setConfig] = useState<ManagerConfig>()

  useEvent(EVENTS.MANAGER.CONFIG, (config) => {
    setIsAuth(true)
    setConfig(config)
  })

  useEvent(EVENTS.MANAGER.GAME_CREATED, ({ gameId, inviteCode }) => {
    setGameId(gameId)
    setStatus(STATUS.SHOW_ROOM, {
      text: "Waiting for the players",
      inviteCode,
    })
    navigate({ to: "/party/manager/$gameId", params: { gameId } })
  })

  const handleAuth = (password: string) => {
    socket?.emit(EVENTS.MANAGER.AUTH, password)
  }

  if (!isAuth || !config) {
    return <ManagerPassword onSubmit={handleAuth} />
  }

  return <Configurations data={config} />
}

export const Route = createFileRoute("/(auth)/manager/")({
  component: ManagerAuthPage,
})
