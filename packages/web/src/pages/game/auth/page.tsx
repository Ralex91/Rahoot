import Room from "@rahoot/web/features/game/components/join/Room"
import Username from "@rahoot/web/features/game/components/join/Username"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/features/game/stores/player"
import { useEffect } from "react"
import toast from "react-hot-toast"

import { translateServerMessage } from "@rahoot/web/features/game/utils/translateServerMessage"

const PlayerAuthPage = () => {
  const { isConnected, connect } = useSocket()
  const { player } = usePlayerStore()

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  useEvent("game:errorMessage", (message) => {
    toast.error(translateServerMessage(message))
  })

  if (player) {
    return <Username />
  }

  return <Room />
}

export default PlayerAuthPage
