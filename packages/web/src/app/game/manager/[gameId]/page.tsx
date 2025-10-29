"use client"

import { STATUS } from "@rahoot/common/types/game/status"
import GameWrapper from "@rahoot/web/components/game/GameWrapper"
import Answers from "@rahoot/web/components/game/states/Answers"
import Leaderboard from "@rahoot/web/components/game/states/Leaderboard"
import Podium from "@rahoot/web/components/game/states/Podium"
import Prepared from "@rahoot/web/components/game/states/Prepared"
import Question from "@rahoot/web/components/game/states/Question"
import Responses from "@rahoot/web/components/game/states/Responses"
import Room from "@rahoot/web/components/game/states/Room"
import Start from "@rahoot/web/components/game/states/Start"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { useQuestionStore } from "@rahoot/web/stores/question"
import { GAME_STATE_COMPONENTS_MANAGER } from "@rahoot/web/utils/constants"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"

const ManagerGame = () => {
  const router = useRouter()
  const { gameId: gameIdParam }: { gameId?: string } = useParams()
  const { socket } = useSocket()
  const { gameId, status, setGameId, setStatus, setPlayers, reset } =
    useManagerStore()
  const { setQuestionStates } = useQuestionStore()

  useEvent("game:status", ({ name, data }) => {
    if (name in GAME_STATE_COMPONENTS_MANAGER) {
      setStatus(name, data)
    }
  })

  useEvent("connect", () => {
    if (gameIdParam) {
      socket?.emit("manager:reconnect", { gameId: gameIdParam })
    }
  })

  useEvent(
    "manager:successReconnect",
    ({ gameId, status, players, currentQuestion }) => {
      setGameId(gameId)
      setStatus(status.name, status.data)
      setPlayers(players)
      setQuestionStates(currentQuestion)
    },
  )

  useEvent("game:reset", (message) => {
    router.replace("/manager")
    reset()
    setQuestionStates(null)
    toast.error(message)
  })

  const handleSkip = () => {
    if (!gameId) {
      return
    }

    switch (status?.name) {
      case STATUS.SHOW_ROOM:
        socket?.emit("manager:startGame", { gameId })

        break

      case STATUS.SELECT_ANSWER:
        socket?.emit("manager:abortQuiz", { gameId })

        break

      case STATUS.SHOW_RESPONSES:
        socket?.emit("manager:showLeaderboard", { gameId })

        break

      case STATUS.SHOW_LEADERBOARD:
        socket?.emit("manager:nextQuestion", { gameId })

        break
    }
  }

  let component = null

  switch (status?.name) {
    case STATUS.SHOW_ROOM:
      component = <Room data={status.data} />

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

    case STATUS.SELECT_ANSWER:
      component = <Answers data={status.data} />

      break

    case STATUS.SHOW_RESPONSES:
      component = <Responses data={status.data} />

      break

    case STATUS.SHOW_LEADERBOARD:
      component = <Leaderboard data={status.data} />

      break

    case STATUS.FINISHED:
      component = <Podium data={status.data} />

      break
  }

  return (
    <GameWrapper statusName={status?.name} onNext={handleSkip} manager>
      {component}
    </GameWrapper>
  )
}

export default ManagerGame
