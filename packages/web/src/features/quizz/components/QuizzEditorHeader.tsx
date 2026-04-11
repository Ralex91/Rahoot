import { EVENTS } from "@rahoot/common/constants"
import logo from "@rahoot/web/assets/logo.svg"
import Button from "@rahoot/web/components/Button"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socket-context"
import { useQuizzEditor } from "@rahoot/web/features/quizz/contexts/quizz-editor-context"
import { useNavigate } from "@tanstack/react-router"
import type { ChangeEvent } from "react"
import toast from "react-hot-toast"

const QuizzEditorHeader = () => {
  const { quizzId, subject, setSubject, questions } = useQuizzEditor()
  const { socket } = useSocket()
  const navigate = useNavigate()

  const handleChangeSubject = (e: ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value)
  }

  const handleSave = () => {
    if (quizzId) {
      socket?.emit(EVENTS.QUIZZ.UPDATE, { id: quizzId, subject, questions })
    } else {
      socket?.emit(EVENTS.QUIZZ.SAVE, { subject, questions })
    }
  }

  useEvent(EVENTS.QUIZZ.SAVE_SUCCESS, () => {
    toast.success("Quizz saved successfully")
    navigate({ to: "/manager/config" })
  })

  useEvent(EVENTS.QUIZZ.UPDATE_SUCCESS, (_data) => {
    toast.success("Quizz updated successfully")
    navigate({ to: "/manager/config" })
  })

  useEvent(EVENTS.QUIZZ.ERROR, (message) => {
    toast.error(message)
  })

  return (
    <header className="z-20 flex h-14 items-center justify-between gap-4 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-6">
        <img src={logo} className="h-8" alt="logo" />

        <input
          className="text-md focus:border-primary w-64 rounded-md border-2 border-gray-200 px-3 py-1.5 font-semibold outline-none"
          value={subject}
          onChange={handleChangeSubject}
          placeholder="Quizz title..."
        />
      </div>

      <div className="flex gap-2">
        <Button
          className="text-md bg-gray-100 px-4 py-2 font-semibold text-gray-600"
          onClick={() => navigate({ to: "/manager" })}
        >
          Exit
        </Button>
        <Button className="bg-primary text-md px-4 py-2" onClick={handleSave}>
          Save
        </Button>
      </div>
    </header>
  )
}

export default QuizzEditorHeader
