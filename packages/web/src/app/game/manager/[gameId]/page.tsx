"use client"

import { Status } from "@rahoot/common/types/game/status"
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
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function ManagerGame() {
  const router = useRouter()
  const { gameId: gameIdParam }: { gameId?: string } = useParams()
  const { socket, isConnected } = useSocket()
  const [nextText, setNextText] = useState("Start")
  const { gameId, status, setGameId, setStatus, setPlayers } = useManagerStore()
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

  useEvent("game:reset", () => {
    router.replace("/manager")
    toast("Game is not available anymore")
  })

  useEffect(() => {
    if (status.name === Status.SHOW_START) {
      setNextText("Start")
    }
  }, [status.name])

  if (!isConnected) {
    return null
  }

  if (!gameId) {
    return null
  }

  const handleSkip = () => {
    setNextText("Skip")

    switch (status.name) {
      case Status.SHOW_ROOM:
        socket?.emit("manager:startGame", { gameId })

        break

      case Status.SELECT_ANSWER:
        socket?.emit("manager:abortQuiz", { gameId })

        break

      case Status.SHOW_RESPONSES:
        socket?.emit("manager:showLeaderboard", { gameId })

        break

      case Status.SHOW_LEADERBOARD:
        socket?.emit("manager:nextQuestion", { gameId })

        break
    }
  }

  let component = null

  switch (status.name) {
    case Status.SHOW_ROOM:
      component = <Room data={status.data} />

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

    case Status.SELECT_ANSWER:
      component = <Answers data={status.data} />

      break

    case Status.SHOW_RESPONSES:
      component = <Responses data={status.data} />

      break

    case Status.SHOW_LEADERBOARD:
      component = <Leaderboard data={status.data} />

      break

    case Status.FINISHED:
      component = <Podium data={status.data} />

      break
  }

  return (
    <GameWrapper textNext={nextText} onNext={handleSkip} manager>
      {component}
    </GameWrapper>
  )
}
