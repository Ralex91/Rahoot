"use client"

import { STATUS } from "@rahoot/common/types/game/status"
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

const Game = () => {
  const router = useRouter()
  const { socket } = useSocket()
  const { gameId: gameIdParam }: { gameId?: string } = useParams()
  const { status, setPlayer, setGameId, setStatus, reset } = usePlayerStore()
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

  useEvent("game:reset", (message) => {
    router.replace("/")
    reset()
    setQuestionStates(null)
    toast.error(message)
  })

  if (!gameIdParam) {
    return null
  }

  let component = null

  switch (status?.name) {
    case STATUS.WAIT:
      component = <Wait data={status.data} />

      break

    case STATUS.SHOW_START:
      component = <Start data={status.data} />

      break

    case STATUS.SHOW_PREPARED:
      component = <Prepared data={status.data} />

      break

    case STATUS.SHOW_QUESTION:
      component = <Question data={status.data} />

      break

    case STATUS.SHOW_RESULT:
      component = <Result data={status.data} />

      break

    case STATUS.SELECT_ANSWER:
      component = <Answers data={status.data} />

      break
  }

  return <GameWrapper statusName={status?.name}>{component}</GameWrapper>
}

export default Game
