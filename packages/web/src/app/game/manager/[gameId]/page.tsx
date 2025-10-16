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
import { useManagerGameStore } from "@rahoot/web/stores/game"
import { GAME_STATE_COMPONENTS_MANAGER } from "@rahoot/web/utils/constants"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ManagerGame() {
  const { socket } = useSocket()
  const [nextText, setNextText] = useState("Start")
  const { status, setStatus } = useManagerGameStore()
  const { gameId }: { gameId?: string } = useParams()

  useEvent("game:status", ({ name, data }) => {
    if (name in GAME_STATE_COMPONENTS_MANAGER) {
      setStatus(name, data)
    }
  })

  useEffect(() => {
    if (status.name === "SHOW_START") {
      setNextText("Start")
    }
  }, [status.name])

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
