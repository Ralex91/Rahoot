import Button from "@rahoot/web/components/Button"
import { useConfig } from "@rahoot/web/features/manager/contexts/config-context"
import { useNavigate } from "@tanstack/react-router"
import { SquarePen, Trash2 } from "lucide-react"

const ConfigManageQuizz = () => {
  const { quizz } = useConfig()
  const navigate = useNavigate()

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
        {quizz.map((quizz) => (
          <div
            key={quizz.id}
            className="flex h-12 w-full items-center justify-between rounded-md pr-1.5 pl-3 outline outline-gray-300"
          >
            <p className="truncate">{quizz.subject}</p>
            <div className="flex gap-0.5">
              <button
                className="rounded-sm p-2 text-gray-600 hover:bg-gray-600/10"
                onClick={() =>
                  navigate({
                    to: "/manager/quizz/$quizzId",
                    params: { quizzId: quizz.id },
                  })
                }
              >
                <SquarePen className="size-4" />
              </button>
              <button className="rounded-sm p-2 hover:bg-red-600/10">
                <Trash2 className="size-4 stroke-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConfigManageQuizz
