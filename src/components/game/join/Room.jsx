import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useEffect, useState } from "react"
import { socket } from "@/context/socket"

export default function Room() {
  const { player, dispatch } = usePlayerContext()
  const [loading, setLoading] = useState(false)
  const [roomId, setRoomId] = useState("")

  const handleLogin = () => {
    socket.emit("player:checkRoom", roomId)
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
    <>
      {loading && (
        <div className="absolute z-30 flex h-full w-full items-center justify-center bg-black/40">
          <Loader />
        </div>
      )}

      <Form>
        <Input
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="PIN Code here"
        />
        <Button onClick={() => handleLogin()}>Submit</Button>
      </Form>
    </>
  )
}
