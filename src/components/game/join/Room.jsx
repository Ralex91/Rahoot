import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useEffect, useState } from "react"
import { socket } from "@/context/socket"

export default function Room() {
  const { player, dispatch } = usePlayerContext()
  const [roomId, setRoomId] = useState("")

  const handleLogin = () => {
    socket.emit("player:checkRoom", roomId)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  useEffect(() => {
    socket.on("game:successRoom", (roomId) => {
      dispatch({ type: "JOIN", payload: roomId })
    })

    return () => {
      socket.off("game:successRoom")
    }
  }, [])

  return (
    <Form>
      <Input
        onChange={(e) => setRoomId(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="PIN Code here"
      />
      <Button onClick={() => handleLogin()}>Submit</Button>
    </Form>
  )
}
