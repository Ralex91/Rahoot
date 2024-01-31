import GameWrapper from "@/components/game/GameWrapper"
import Answers from "@/components/game/states/Answers"
import Leaderboard from "@/components/game/states/Leaderboard"
import Question from "@/components/game/states/Question"
import Wait from "@/components/game/states/Wait"
import { useSocketContext } from "@/context/socket"
import { createElement, useEffect, useMemo, useState } from "react"

export default function Manager({ children }) {
  const { socket } = useSocketContext()

  const [gameState, setGameState] = useState({
    status: {
      name: "PENDING",
    },
    cooldown: 0,
    answers: [],
  })

  socket.on("game:status", (status) => {
    setGameState({
      ...gameState,
      status: status,
      cooldown: 0,
    })
  })

  return (
    <>
      <p className="text-white">{JSON.stringify(gameState)}</p>
      <hr></hr>
      <div className="flex gap-2">
        <button
          className="bg-primary p-2"
          onClick={() => socket.emit("manager:createRoom")}
        >
          Create Room
        </button>

        <button
          className="bg-primary p-2"
          onClick={() => socket.emit("manager:startGame")}
        >
          Start Game
        </button>

        <button
          className="bg-primary p-2"
          onClick={() => socket.emit("manager:showLeaderboard")}
        >
          Leaderboard
        </button>

        <button
          className="bg-primary p-2"
          onClick={() => socket.emit("manager:nextQuestion")}
        >
          Next Question
        </button>
      </div>
    </>
  )
}
