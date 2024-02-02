import GameWrapper from "@/components/game/GameWrapper"
import Answers from "@/components/game/states/Answers"
import Leaderboard from "@/components/game/states/Leaderboard"
import Prepared from "@/components/game/states/Prepared"
import Question from "@/components/game/states/Question"
import Result from "@/components/game/states/Result"
import Wait from "@/components/game/states/Wait"
import Start from "@/components/game/states/Start"
import { usePlayerContext } from "@/context/player"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"
import { createElement, useMemo, useState } from "react"

const gameStateComponent = {
  SELECT_ANSWER: Answers,
  SHOW_QUESTION: Question,
  WAIT: Wait,
  SHOW_START: Start,
  SHOW_RESULT: Result,
  SHOW_PREPARED: Prepared,
}

export default function Game() {
  const router = useRouter()

  const { socket } = useSocketContext()
  const { player } = usePlayerContext()

  if (!player) {
    //router.push("/")
    return
  }

  const [state, setState] = useState({
    status: {
      name: "WAIT",
      data: { text: "Waiting for the players" },
    },
    question: {
      current: 1,
      total: null,
    },
  })

  useMemo(() => {
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

    return () => {
      socket.off("game:status")
    }
  }, [state])

  return (
    <GameWrapper>
      {gameStateComponent[state.status.name] &&
        createElement(gameStateComponent[state.status.name], {
          data: state.status.data,
        })}
    </GameWrapper>
  )
}
