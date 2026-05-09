import { EVENTS } from "@razzia/common/constants"
import Button from "@razzia/web/components/Button"
import { useSocket } from "@razzia/web/features/game/contexts/socket-context"
import { useConfig } from "@razzia/web/features/manager/contexts/config-context"
import clsx from "clsx"
import { Check } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

const ConfigSelectQuizz = () => {
  const { socket } = useSocket()
  const { quizz: quizzList } = useConfig()
  const [selected, setSelected] = useState<string | null>(null)
  const { t } = useTranslation()

  const handleSelect = (id: string) => () => {
    if (selected === id) {
      setSelected(null)
    } else {
      setSelected(id)
    }
  }

  const handleSubmit = () => {
    if (!selected) {
      toast.error(t("manager:quizz.pleaseSelect"))

      return
    }

    socket.emit(EVENTS.GAME.CREATE, selected)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {quizzList.length > 0 && (
        <Button className="mb-4 shrink-0" onClick={handleSubmit}>
          {t("manager:quizz.startGame")}
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
                <Check className="size-full stroke-4 text-white" />
              )}
            </div>
          </button>
        ))}
        {!quizzList.length && (
          <div className="my-8 text-center text-gray-500">
            <p>{t("manager:quizz.notFound")}</p>
            <p className="text-sm">{t("manager:quizz.pleaseCreate")}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConfigSelectQuizz
