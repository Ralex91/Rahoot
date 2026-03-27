import type { QuizzWithId } from "@rahoot/common/types/game"
import Button from "@rahoot/web/features/game/components/Button"
import Input from "@rahoot/web/features/game/components/Input"
import clsx from "clsx"
import { type KeyboardEvent, useMemo, useState } from "react"
import toast from "react-hot-toast"

type Props = {
  quizzList: QuizzWithId[]
  onSelect: (_id: string) => void
  onCreate: (_subject: string) => void
  onDelete: (_id: string) => void
  onEdit: (_id: string) => void
}

const SelectQuizz = ({
  quizzList,
  onCreate,
  onDelete,
  onEdit,
  onSelect,
}: Props) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [subject, setSubject] = useState("")

  const sortedQuizzList = useMemo(
    () => [...quizzList].sort((a, b) => a.subject.localeCompare(b.subject)),
    [quizzList],
  )

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

    onSelect(selected)
  }

  const handleCreate = () => {
    const trimmedSubject = subject.trim()

    if (!trimmedSubject) {
      toast.error("Please enter a quiz name")

      return
    }

    onCreate(trimmedSubject)
    setSubject("")
  }

  const handleDelete = (id: string) => () => {
    const quizz = quizzList.find((item) => item.id === id)

    if (!quizz) {
      return
    }

    const confirmed = window.confirm(
      `Delete "${quizz.subject}"? This removes its JSON file.`,
    )

    if (!confirmed) {
      return
    }

    if (selected === id) {
      setSelected(null)
    }

    onDelete(id)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCreate()
    }
  }

  return (
    <div className="z-10 flex w-full max-w-2xl flex-col gap-5 rounded-md bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Manage quizzes</h1>
        <div className="flex flex-col gap-2 md:flex-row">
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="New quiz name"
            className="flex-1"
          />
          <Button onClick={handleCreate} className="px-4">
            Create quiz
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="mb-2 flex w-full items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Available quizzes</h2>
          <span className="text-sm font-semibold text-gray-500">
            {sortedQuizzList.length} total
          </span>
        </div>

        <div className="w-full space-y-2">
          {sortedQuizzList.length === 0 && (
            <div className="rounded-md border border-dashed border-gray-300 p-4 text-center text-gray-500">
              No quizzes yet. Create one to get started.
            </div>
          )}

          {sortedQuizzList.map((quizz) => (
            <div
              key={quizz.id}
              className={clsx(
                "flex w-full items-center gap-3 rounded-md p-3 text-left outline outline-gray-300",
              )}
              role="button"
              tabIndex={0}
              onClick={handleSelect(quizz.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  handleSelect(quizz.id)()
                }
              }}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold">{quizz.subject}</p>
                <p className="text-sm text-gray-500">
                  {quizz.questions.length} questions
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  className="bg-white px-3 py-1 text-sm text-black!"
                  onClick={(event) => {
                    event.stopPropagation()
                    onEdit(quizz.id)
                  }}
                >
                  Edit
                </Button>

                <div
                  className={clsx(
                    "h-5 w-5 shrink-0 rounded outline outline-offset-3 outline-gray-300",
                    selected === quizz.id &&
                      "bg-primary border-primary/80 shadow-inset",
                  )}
                ></div>

                <Button
                  type="button"
                  className="bg-red-500 px-3 py-1 text-sm"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleDelete(quizz.id)()
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit}>Start selected quiz</Button>
    </div>
  )
}

export default SelectQuizz
