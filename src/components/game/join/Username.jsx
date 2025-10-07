import Button from "@/components/Button"
import Form from "@/components/Form"
import Input from "@/components/Input"
import { usePlayerContext } from "@/context/player"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Username() {
  const { socket } = useSocketContext()
  const { player, dispatch } = usePlayerContext()
  const router = useRouter()
  const [username, setUsername] = useState("")

//here we save the sessionToken in browser storage of player. if it exists, then the player can easily rejoin.
  const handleJoin = () => {
    let sessionToken
    try {
      sessionToken = localStorage.getItem("rahoot_sessionToken")
    } catch {}
    socket.emit("player:join", { username: username, room: player.room, sessionToken })
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleJoin()
    }
  }

  useEffect(() => {
    const onSuccessJoin = ({ sessionToken }) => { //using sessionToken
      try {
        localStorage.setItem("rahoot_sessionToken", sessionToken)
      } catch {}
      dispatch({ type: "LOGIN", payload: username })
      router.replace("/game")
    }

    const onRejoinSuccess = ({ username: uname, room }) => { //using username
      dispatch({ type: "JOIN", payload: room })
      dispatch({ type: "LOGIN", payload: uname })
      router.replace("/game")
    }

    socket.on("game:successJoin", onSuccessJoin)
    socket.on("game:rejoinSuccess", onRejoinSuccess)

    return () => {
      socket.off("game:successJoin", onSuccessJoin)
      socket.off("game:rejoinSuccess", onRejoinSuccess)
    }
  }, [username])

  return (
    <Form>
      <Input
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Username here"
      />
      <Button onClick={() => handleJoin()}>Submit</Button>
    </Form>
  )
}
