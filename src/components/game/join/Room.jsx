import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useState } from "react"

export default function Room() {
  const { player, dispatch } = usePlayerContext()
  const [loading, setLoading] = useState(false)
  const [roomId, setRoomId] = useState("207223")

  const handleLogin = () => {
    dispatch({ type: "JOIN", payload: roomId })
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
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="PIN Code here"
        />
        <Button onClick={() => handleLogin()}>Submit</Button>
      </Form>
    </>
  )
}
