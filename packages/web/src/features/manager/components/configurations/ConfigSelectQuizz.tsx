import { EVENTS } from "@rahoot/common/constants"
import Button from "@rahoot/web/components/Button"
import { useSocket } from "@rahoot/web/features/game/contexts/socket-context"
import { useConfig } from "@rahoot/web/features/manager/contexts/config-context"
import clsx from "clsx"
import { Check } from "lucide-react"
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
    <div className="flex min-h-0 flex-1 flex-col">
      {quizzList.length > 0 && (
        <Button className="mb-4 shrink-0" onClick={handleSubmit}>
          Start game
        </Button>
      )}
      <div className="min-h-0 flex-1 space-y-2 overflow-auto p-0.5">
        {quizzList.map((quizz) => (
          <button
            key={quizz.id}
            className="flex w-full items-center justify-between rounded-md p-3 outline outline-gray-300"
            onClick={handleSelect(quizz.id)}
          >
            {quizz.subject}

            <div
              className={clsx(
                "size-5 rounded p-0.5 outline outline-offset-3 outline-gray-300",
                selected === quizz.id && "bg-primary border-primary/80",
              )}
            >
              {selected === quizz.id && (
                <Check className="size-full stroke-2 text-white" />
              )}
            </div>
          </button>
        ))}
        {!quizzList.length && (
          <div className="my-8 text-center text-gray-500">
            <p>No quizz found</p>
            <p className="text-sm">Please create a quizz first</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConfigSelectQuizz
