import { EVENTS } from "@rahoot/common/constants"
import AlertDialog from "@rahoot/web/components/AlertDialog"
import Button from "@rahoot/web/components/Button"
import { useSocket } from "@rahoot/web/features/game/contexts/socket-context"
import { useConfig } from "@rahoot/web/features/manager/contexts/config-context"
import { useNavigate } from "@tanstack/react-router"
import { SquarePen, Trash2 } from "lucide-react"

const ConfigManageQuizz = () => {
  const { quizz } = useConfig()
  const { socket } = useSocket()
  const navigate = useNavigate()

  const handleDelete = (id: string) => () => {
    socket?.emit(EVENTS.QUIZZ.DELETE, id)
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <Button
          className="mb-4 flex-1"
          onClick={() => navigate({ to: "/manager/quizz" })}
        >
          Create Quizz
        </Button>
      </div>
      <div className="w-full space-y-2">
        {quizz.map((q) => (
          <div
            key={q.id}
            className="flex h-12 w-full items-center justify-between rounded-md pr-1.5 pl-3 outline outline-gray-300"
          >
            <p className="truncate">{q.subject}</p>
            <div className="flex gap-0.5">
              <button
                className="rounded-sm p-2 text-gray-600 hover:bg-gray-600/10"
                onClick={() =>
                  navigate({
                    to: "/manager/quizz/$quizzId",
                    params: { quizzId: q.id },
                  })
                }
              >
                <SquarePen className="size-4" />
              </button>

              <AlertDialog
                trigger={
                  <button className="rounded-sm p-2 hover:bg-red-600/10">
                    <Trash2 className="size-4 stroke-red-500" />
                  </button>
                }
                title="Delete quizz"
                description={`Are you sure you want to delete "${q.subject}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={handleDelete(q.id)}
              />
            </div>
          </div>
        ))}
        {quizz.length === 0 && (
          <p className="text-center text-gray-500">No quizz created yet</p>
        )}
      </div>
    </div>
  )
}

export default ConfigManageQuizz
