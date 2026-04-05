import { EVENTS } from "@rahoot/common/constants"
import type { QuizzWithId } from "@rahoot/common/types/game"
import { STATUS } from "@rahoot/common/types/game/status"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/features/game/stores/manager"
import ManagerPassword from "@rahoot/web/features/manager/components/ManagerPassword"
import SelectQuizz from "@rahoot/web/features/manager/components/SelectQuizz"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"

const ManagerAuthPage = () => {
  const { setGameId, setStatus } = useManagerStore()
  const navigate = useNavigate()
  const { socket } = useSocket()

  const [isAuth, setIsAuth] = useState(false)
  const [quizzList, setQuizzList] = useState<QuizzWithId[]>([])

  useEvent(EVENTS.MANAGER.QUIZZ_LIST, (quizzList) => {
    setIsAuth(true)
    setQuizzList(quizzList)
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
  const handleCreate = (quizzId: string) => {
    socket?.emit(EVENTS.GAME.CREATE, quizzId)
  }

  if (!isAuth) {
    return <ManagerPassword onSubmit={handleAuth} />
  }

  return <SelectQuizz quizzList={quizzList} onSelect={handleCreate} />
}

export const Route = createFileRoute("/(auth)/manager/")({
  component: ManagerAuthPage,
})
