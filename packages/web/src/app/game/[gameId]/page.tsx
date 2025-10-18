"use client"

import { Status } from "@rahoot/common/types/game/status"
import GameWrapper from "@rahoot/web/components/game/GameWrapper"
import Answers from "@rahoot/web/components/game/states/Answers"
import Prepared from "@rahoot/web/components/game/states/Prepared"
import Question from "@rahoot/web/components/game/states/Question"
import Result from "@rahoot/web/components/game/states/Result"
import Start from "@rahoot/web/components/game/states/Start"
import Wait from "@rahoot/web/components/game/states/Wait"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { useQuestionStore } from "@rahoot/web/stores/question"
import { GAME_STATE_COMPONENTS } from "@rahoot/web/utils/constants"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function Game() {
  const router = useRouter()
  const { socket, isConnected } = useSocket()
  const { gameId: gameIdParam }: { gameId?: string } = useParams()
  const { status, setPlayer, logout, setGameId, setStatus, resetStatus } =
    usePlayerStore()
  const { setQuestionStates } = useQuestionStore()

  useEvent("connect", () => {
    if (gameIdParam) {
      socket?.emit("player:reconnect", { gameId: gameIdParam })
    }
  })

  useEvent(
    "player:successReconnect",
    ({ gameId, status, player, currentQuestion }) => {
      setGameId(gameId)
      setStatus(status.name, status.data)
      setPlayer(player)
      setQuestionStates(currentQuestion)
    },
  )

  useEvent("game:status", ({ name, data }) => {
    if (name in GAME_STATE_COMPONENTS) {
      setStatus(name, data)
    }
  })

  useEvent("game:reset", () => {
    router.replace("/")
    resetStatus()
    logout()
    toast("The game has been reset by the host")
  })

  if (!isConnected) {
    return null
  }

  if (!gameIdParam) {
    return null
  }

  let component = null

  switch (status.name) {
    case Status.WAIT:
      component = <Wait data={status.data} />

      break

    case Status.SHOW_START:
      component = <Start data={status.data} />

      break

    case Status.SHOW_PREPARED:
      component = <Prepared data={status.data} />

      break

    case Status.SHOW_QUESTION:
      component = <Question data={status.data} />

      break

    case Status.SHOW_RESULT:
      component = <Result data={status.data} />

      break

    case Status.SELECT_ANSWER:
      component = <Answers data={status.data} />

      break
  }

  return <GameWrapper>{component}</GameWrapper>
}
