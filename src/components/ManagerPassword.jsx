import Image from "next/image"
import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { useEffect, useState } from "react"
import { socket } from "@/context/socket"
import logo from "@/assets/logo.svg"
import toast from "react-hot-toast"

export default function ManagerPassword() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")

  const handleCreate = () => {
    socket.emit("manager:createRoom", password)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCreate()
    }
  }

  useEffect(() => {
    socket.on("game:errorMessage", (message) => {
      toast.error(message)
    })

    return () => {
      socket.off("game:errorMessage")
    }
  }, [])

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-outline">
      <div className="absolute h-full w-full overflow-hidden">
        <div className="absolute -left-[15vmin] -top-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full bg-white"></div>
        <div className="absolute -bottom-[15vmin] -right-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45 bg-white"></div>
      </div>

      <Image src={logo} className="absolute top-20 h-[200px] w-auto" alt="logo" />

      <Form>
        <Input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mots de passe Manager"
        />
        <Button onClick={() => handleCreate()}>Envoyer</Button>
      </Form>
    </section>
  )
}
