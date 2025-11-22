"use client"

import { STATUS } from "@rahoot/common/types/game/status"
import Button from "@rahoot/web/components/Button"
import EmojiPicker from "@rahoot/web/components/EmojiPicker"
import Form from "@rahoot/web/components/Form"
import Input from "@rahoot/web/components/Input"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"

import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

const Username = () => {
  const { socket } = useSocket()
  const { gameId, login, setStatus } = usePlayerStore()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)

  const handleLogin = () => {
    if (!gameId || !selectedEmoji) {
      return
    }

    socket?.emit("player:login", { gameId, data: { username, emoji: selectedEmoji } })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  useEvent("game:successJoin", (gameId) => {
    setStatus(STATUS.WAIT, { text: "Waiting for the players" })
    login(username)

    router.replace(`/game/${gameId}`)
  })

  return (
    <Form>
      <Input
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Username here"
      />
      <EmojiPicker selectedEmoji={selectedEmoji} onSelect={setSelectedEmoji} />
      <Button onClick={handleLogin} disabled={!username || !selectedEmoji}>
        Submit
      </Button>
    </Form>
  )
}

export default Username
