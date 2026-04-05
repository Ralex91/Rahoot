import { EVENTS } from "@rahoot/common/constants"
import Button from "@rahoot/web/components/Button"
import Card from "@rahoot/web/components/Card"
import Input from "@rahoot/web/components/Input"
import { useEvent } from "@rahoot/web/features/game/contexts/socketProvider"
import { type KeyboardEvent, useState } from "react"
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

  useEvent(EVENTS.MANAGER.ERROR_MESSAGE, (message) => {
    toast.error(message)
  })

  return (
    <Card>
      <Input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Manager password"
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </Card>
  )
}

export default ManagerPassword
