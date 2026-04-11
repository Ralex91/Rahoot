import { EVENTS } from "@rahoot/common/constants"
import Button from "@rahoot/web/components/Button"
import { useSocket } from "@rahoot/web/features/game/contexts/socket-context"
import { useConfig } from "@rahoot/web/features/manager/contexts/config-context"
import clsx from "clsx"
import { useState } from "react"
import toast from "react-hot-toast"

const ConfigSelectQuizz = () => {
  const { socket } = useSocket()
  const { quizz: quizzList } = useConfig()
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (id: string) => () => {
    if (selected === id) {
      setSelected(null)
    } else {
      setSelected(id)
    }
  }

  const handleSubmit = () => {
    if (!selected) {
      toast.error("Please select a quizz")

      return
    }

    socket?.emit(EVENTS.GAME.CREATE, selected)
  }

  return (
    <div className="flex flex-col">
      <h1 className="mb-2 text-lg font-semibold text-gray-600">
        Select a quizz
      </h1>
      <div className="w-full space-y-2">
        {quizzList.map((quizz) => (
          <button
            key={quizz.id}
            className="flex w-full items-center justify-between rounded-md p-3 outline outline-gray-300"
            onClick={handleSelect(quizz.id)}
          >
            {quizz.subject}

            <div
              className={clsx(
                "h-5 w-5 rounded outline outline-offset-3 outline-gray-300",
                selected === quizz.id &&
                  "bg-primary border-primary/80 shadow-inset",
              )}
            ></div>
          </button>
        ))}
      </div>
      <Button className="mt-4" onClick={handleSubmit}>
        Start game
      </Button>
    </div>
  )
}

export default ConfigSelectQuizz
