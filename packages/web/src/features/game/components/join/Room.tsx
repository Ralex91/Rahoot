import { EVENTS } from "@rahoot/common/constants"
import Button from "@rahoot/web/components/Button"
import Card from "@rahoot/web/components/Card"
import Input from "@rahoot/web/components/Input"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socket-context"
import { usePlayerStore } from "@rahoot/web/features/game/stores/player"
import { useSearch } from "@tanstack/react-router"
import { type KeyboardEvent, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

const Room = () => {
  const { socket, isConnected } = useSocket()
  const { join } = usePlayerStore()
  const [invitation, setInvitation] = useState("")
  const { pin } = useSearch({ from: "/(auth)/" })
  const hasJoinedRef = useRef(false)
  const { t } = useTranslation()

  const handleJoin = () => {
    socket?.emit(EVENTS.PLAYER.JOIN, invitation)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleJoin()
    }
  }

  useEvent(EVENTS.GAME.SUCCESS_ROOM, (gameId) => {
    join(gameId)
  })

  useEffect(() => {
    if (!isConnected || !pin || hasJoinedRef.current) {
      return
    }

    socket?.emit("player:join", pin)
    hasJoinedRef.current = true
  }, [pin, isConnected, socket])

  return (
    <Card>
      <Input
        className="text-center"
        onChange={(e) => setInvitation(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("game:pinPlaceholder")}
      />
      <Button className="mt-4" onClick={handleJoin}>
        {t("common:submit")}
      </Button>
    </Card>
  )
}

export default Room
