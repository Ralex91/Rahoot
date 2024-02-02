import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useEffect, useState } from "react"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"

export default function Username() {
  const { socket } = useSocketContext()
  const { player, dispatch } = usePlayerContext()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [username, setUsername] = useState("")

  const handleJoin = () => {
    socket.emit("player:join", { username: username, room: player.room })
  }

  useEffect(() => {
    socket.on("game:successJoin", () => {
      dispatch({
        type: "LOGIN",
        payload: username,
      })

      router.replace("/game")
    })

    return () => {
      socket.off("game:successJoin")
    }
  }, [username])

  return (
    <>
      {loading && (
        <div className="absolute z-30 flex h-full w-full items-center justify-center bg-black/40">
          <Loader />
        </div>
      )}

      <Form>
        <Input
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usernname here"
        />
        <Button onClick={() => handleJoin()}>Submit</Button>
      </Form>
    </>
  )
}
