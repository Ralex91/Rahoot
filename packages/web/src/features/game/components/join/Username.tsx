import { EVENTS } from "@rahoot/common/constants"
import { STATUS } from "@rahoot/common/types/game/status"
import Button from "@rahoot/web/components/Button"
import Card from "@rahoot/web/components/Card"
import Input from "@rahoot/web/components/Input"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socket-context"
import { usePlayerStore } from "@rahoot/web/features/game/stores/player"

import { useNavigate } from "@tanstack/react-router"
import { type KeyboardEvent, useState } from "react"
import { useTranslation } from "react-i18next"

const Username = () => {
  const { socket } = useSocket()
  const { gameId, login, setStatus } = usePlayerStore()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const { t } = useTranslation()

  const handleLogin = () => {
    if (!gameId) {
      return
    }

    socket?.emit(EVENTS.PLAYER.LOGIN, { gameId, data: { username } })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  useEvent(EVENTS.GAME.SUCCESS_JOIN, (gameId) => {
    setStatus(STATUS.WAIT, { text: "game:waitingForPlayers" })
    login(username)

    navigate({ to: "/party/$gameId", params: { gameId } })
  })

  return (
    <Card>
      <Input
        className="text-center"
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("game:usernamePlaceholder")}
      />
      <Button className="mt-4" onClick={handleLogin}>
        {t("common:submit")}
      </Button>
    </Card>
  )
}

export default Username
