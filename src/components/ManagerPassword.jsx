import logo from "@/assets/logo.svg"
import Button from "@/components/Button"
import Form from "@/components/Form"
import Input from "@/components/Input"
import { socket } from "@/context/socket"
import Image from "next/image"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function ManagerPassword() {
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
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute h-full w-full overflow-hidden">
        <div className="absolute -left-[15vmin] -top-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full bg-primary/15"></div>
        <div className="absolute -bottom-[15vmin] -right-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45 bg-primary/15"></div>
      </div>

      <Image src={logo} className="mb-6 h-32" alt="logo" />

      <Form>
        <Input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Manager password"
        />
        <Button onClick={() => handleCreate()}>Submit</Button>
      </Form>
    </section>
  )
}
