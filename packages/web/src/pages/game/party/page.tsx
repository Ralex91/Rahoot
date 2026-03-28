import GameWrapper from "@rahoot/web/features/game/components/GameWrapper"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/features/game/stores/player"
import { useQuestionStore } from "@rahoot/web/features/game/stores/question"
import {
  GAME_STATE_COMPONENTS,
  isKeyOf,
} from "@rahoot/web/features/game/utils/constants"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router"

const PlayerGamePage = () => {
  const navigate = useNavigate()
  const { socket, reconnect } = useSocket()
  const { gameId: gameIdParam }: { gameId?: string } = useParams()
  const { status, setPlayer, setGameId, setStatus, reset } = usePlayerStore()
  const { setQuestionStates } = useQuestionStore()

  useEvent("connect", () => {
    if (gameIdParam) {
      socket?.emit("player:reconnect", { gameId: gameIdParam })
    }
  })

  useEffect(() => {
    if (!gameIdParam) {
      return
    }

    const attemptReconnect = () => {
      if (!socket?.connected) {
        reconnect()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        attemptReconnect()
      }
    }

    window.addEventListener("focus", attemptReconnect)
    window.addEventListener("pageshow", attemptReconnect)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("focus", attemptReconnect)
      window.removeEventListener("pageshow", attemptReconnect)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [gameIdParam, reconnect, socket])

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
    navigate("/")
    reset()
    setQuestionStates(null)
    toast.error(message)
  })

  if (!gameIdParam) {
    return null
  }

  const CurrentComponent =
    status && isKeyOf(GAME_STATE_COMPONENTS, status.name)
      ? GAME_STATE_COMPONENTS[status.name]
      : null

  return (
    <GameWrapper statusName={status?.name}>
      {CurrentComponent && <CurrentComponent data={status!.data as never} />}
    </GameWrapper>
  )
}

export default PlayerGamePage
