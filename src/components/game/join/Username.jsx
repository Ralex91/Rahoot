import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useState } from "react"
import { useSocketContext } from "@/context/socket"
import { useRouter } from "next/router"

export default function Username() {
  const { socket } = useSocketContext()
  const { player, dispatch } = usePlayerContext()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [username, setUsername] = useState("")

  const handleJoin = () => {
    dispatch({
      type: "LOGIN",
      payload: username,
    })

    router.push("/game")
  }

  return (
    <>
      {loading && (
        <div className="absolute w-full h-full z-30 bg-black/40 flex justify-center items-center">
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
