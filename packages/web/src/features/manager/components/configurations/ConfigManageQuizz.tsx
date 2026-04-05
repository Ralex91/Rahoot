import Button from "@rahoot/web/components/Button"
import { useSettings } from "@rahoot/web/features/manager/contexts/settings-context"
import { SquarePen, Trash } from "lucide-react"

const ConfigManageQuizz = () => {
  const { quizz } = useSettings()

  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <Button className="mb-4 flex-1">Create Quizz</Button>
      </div>
      {quizz.map((quizz) => (
        <div
          key={quizz.id}
          className="flex h-12 w-full items-center justify-between rounded-md pr-1.5 pl-3 outline outline-gray-300"
        >
          <p className="truncate">{quizz.subject}</p>
          <div className="flex gap-0.5">
            <button className="rounded-sm p-2 hover:bg-gray-600/10">
              <SquarePen className="size-4" />
            </button>
            <button className="rounded-sm p-2 hover:bg-red-600/10">
              <Trash className="size-4 stroke-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ConfigManageQuizz
