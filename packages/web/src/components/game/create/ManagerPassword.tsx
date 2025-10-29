import Button from "@rahoot/web/components/Button"
import Form from "@rahoot/web/components/Form"
import Input from "@rahoot/web/components/Input"
import { useEvent } from "@rahoot/web/contexts/socketProvider"
import { KeyboardEvent, useState } from "react"
import toast from "react-hot-toast"

type Props = {
  onSubmit: (_password: string) => void
}

const ManagerPassword = ({ onSubmit }: Props) => {
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
    <Form>
      <Input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Manager password"
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </Form>
  )
}

export default ManagerPassword
