import GameWrapper from "@/components/game/GameWrapper"
import Answers from "@/components/game/states/Answers"
import Leaderboard from "@/components/game/states/Leaderboard"
import Question from "@/components/game/states/Question"
import Start from "@/components/game/states/Start"
import Wait from "@/components/game/states/Wait"
import { usePlayerContext } from "@/context/player"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"
import { createElement, useState } from "react"

const gameStateComponent = {
  SHOW_START: Start,
  SELECT_ANSWER: Answers,
  SHOW_QUESTION: Question,
  WAIT: Wait,
  SHOW_RESPONSES: Answers,
  SHOW_LEADERBOARD: Leaderboard,
}

export default function Manager() {
  const { socket } = useSocketContext()
  const { player } = usePlayerContext()

  const [nextText, setNextText] = useState("Start")
  const [state, setState] = useState({
    status: {
      name: "SHOW_START",
      data: { text: "Waiting for the players" },
    },
    question: {
      current: 1,
      total: null,
    },
  })

  socket.on("game:status", (status) => {
    setState({
      ...state,
      status: status,
      question: {
        ...state.question,
        current: status.question,
      },
    })
  })

  const handleSkip = () => {
    setNextText("Skip")

    switch (state.status.name) {
      case "SHOW_START":
        socket.emit("manager:startGame")
        break

      case "SHOW_RESPONSES":
        socket.emit("manager:showLeaderboard")
        break

      case "SHOW_LEADERBOARD":
        socket.emit("manager:nextQuestion")
        break
    }
  }

  return (
    <GameWrapper textNext={nextText} onNext={handleSkip} manager>
      {gameStateComponent[state.status.name] &&
        createElement(gameStateComponent[state.status.name], {
          data: state.status.data,
        })}
    </GameWrapper>
  )
}
