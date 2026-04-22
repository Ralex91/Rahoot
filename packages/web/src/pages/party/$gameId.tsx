import { EVENTS } from "@rahoot/common/constants"
import GameWrapper from "@rahoot/web/features/game/components/GameWrapper"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socket-context"
import { usePlayerStore } from "@rahoot/web/features/game/stores/player"
import { useQuestionStore } from "@rahoot/web/features/game/stores/question"
import {
  GAME_STATE_COMPONENTS,
  isKeyOf,
} from "@rahoot/web/features/game/utils/constants"
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

const PlayerGamePage = () => {
  const navigate = useNavigate()
  const { socket } = useSocket()
  const { gameId: gameIdParam } = useParams({ from: "/party/$gameId" })
  const { status, setPlayer, setGameId, setStatus, reset } = usePlayerStore()
  const { setQuestionStates } = useQuestionStore()
  const { t } = useTranslation()

  useEvent("connect", () => {
    if (gameIdParam) {
      socket?.emit(EVENTS.PLAYER.RECONNECT, { gameId: gameIdParam })
    }
  })

  useEvent(
    EVENTS.PLAYER.SUCCESS_RECONNECT,
    ({ gameId, status, player, currentQuestion }) => {
      setGameId(gameId)
      setStatus(status.name, status.data)
      setPlayer(player)
      setQuestionStates(currentQuestion)
    },
  )

  useEvent(EVENTS.GAME.STATUS, ({ name, data }) => {
    if (name in GAME_STATE_COMPONENTS) {
      setStatus(name, data)
    }
  })

  useEvent(EVENTS.GAME.RESET, (message) => {
    navigate({ to: "/" })
    reset()
    setQuestionStates(null)
    toast.error(t(message))
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

export const Route = createFileRoute("/party/$gameId")({
  component: PlayerGamePage,
})
