import logo from "@rahoot/web/assets/logo.svg"
import Button from "@rahoot/web/components/Button"
import Form from "@rahoot/web/components/Form"
import Input from "@rahoot/web/components/Input"
import { useEvent } from "@rahoot/web/contexts/socketProvider"
import Image from "next/image"
import { KeyboardEvent, useState } from "react"
import toast from "react-hot-toast"

type Props = {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (password: string) => void
}

export default function ManagerPassword({ onSubmit }: Props) {
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    onSubmit(password)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit()
    }
  }

  useEvent("manager:errorMessage", (message) => {
    toast.error(message)
  })

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute h-full w-full overflow-hidden">
        <div className="bg-primary/15 absolute -top-[15vmin] -left-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full"></div>
        <div className="bg-primary/15 absolute -right-[15vmin] -bottom-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45"></div>
      </div>

      <Image src={logo} className="mb-6 h-32" alt="logo" />

      <Form>
        <Input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Manager password"
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
    </section>
  )
}
