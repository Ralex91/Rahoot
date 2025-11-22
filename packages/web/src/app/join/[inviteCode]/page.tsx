"use client"

import Username from "@rahoot/web/components/game/join/Username"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const JoinWithCode = () => {
  const { inviteCode }: { inviteCode?: string } = useParams()
  const { socket, isConnected, connect } = useSocket()
  const { player, join } = usePlayerStore()
  const [hasJoined, setHasJoined] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  useEffect(() => {
    if (isConnected && socket && inviteCode && !hasJoined && !player) {
      socket.emit("player:join", inviteCode)
      setHasJoined(true)
    }
  }, [isConnected, socket, inviteCode, hasJoined, player])

  useEvent("game:successRoom", (gameId) => {
    join(gameId)
  })

  useEvent("game:errorMessage", (message) => {
    toast.error(message)
  })

  if (player) {
    return <Username />
  }

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">
          Joining game with code: {inviteCode}
        </h2>
      </div>
    </section>
  )
}

export default JoinWithCode
