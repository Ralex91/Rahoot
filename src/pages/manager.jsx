import Button from "@/components/Button"
import GameWrapper from "@/components/game/GameWrapper"
import Answers from "@/components/game/states/Answers"
import Leaderboard from "@/components/game/states/Leaderboard"
import Prepared from "@/components/game/states/Prepared"
import Question from "@/components/game/states/Question"
import Room from "@/components/game/states/Room"
import Start from "@/components/game/states/Start"
import Wait from "@/components/game/states/Wait"
import { usePlayerContext } from "@/context/player"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"
import { createElement, useEffect, useState } from "react"

const gameStateComponent = {
  SHOW_ROOM: Room,
  SHOW_START: Start,
  SELECT_ANSWER: Answers,
  SHOW_QUESTION: Question,
  WAIT: Wait,
  SHOW_RESPONSES: Answers,
  SHOW_LEADERBOARD: Leaderboard,
  SHOW_PREPARED: Prepared,
}

export default function Manager() {
  const { socket } = useSocketContext()

  const [nextText, setNextText] = useState("Start")
  const [state, setState] = useState({
    created: false,
    status: {
      name: "SHOW_ROOM",
      data: { text: "Waiting for the players" },
    },
    question: {
      current: 1,
      total: null,
    },
  })

  useEffect(() => {
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

    socket.on("manager:inviteCode", (inviteCode) => {
      setState({
        ...state,
        created: true,
        status: {
          ...state.status,
          data: {
            ...state.status.data,
            inviteCode: inviteCode,
          },
        },
      })
    })

    return () => {
      socket.off("game:status")
      socket.off("manager:inviteCode")
    }
  }, [state])

  const handleCreate = () => {
    socket.emit("manager:createRoom")
  }

  const handleSkip = () => {
    setNextText("Skip")

    switch (state.status.name) {
      case "SHOW_ROOM":
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
    <>
      {!state.created ? (
        <div>
          <Button onClick={handleCreate}>Create Room</Button>
        </div>
      ) : (
        <>
          <GameWrapper textNext={nextText} onNext={handleSkip} manager>
            {gameStateComponent[state.status.name] &&
              createElement(gameStateComponent[state.status.name], {
                data: state.status.data,
              })}
          </GameWrapper>
        </>
      )}
    </>
  )
}
