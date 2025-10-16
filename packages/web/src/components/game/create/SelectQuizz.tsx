import { Quizz } from "@rahoot/common/types/game"
import logo from "@rahoot/web/assets/logo.svg"
import Button from "@rahoot/web/components/Button"
import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"
import toast from "react-hot-toast"

type QuizzWithId = Quizz & { id: string }

type Props = {
  quizzList: QuizzWithId[]
  // eslint-disable-next-line no-unused-vars
  onSelect: (id: string) => void
}

export default function SelectQuizz({ quizzList, onSelect }: Props) {
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

    onSelect(selected)
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="absolute h-full w-full overflow-hidden">
        <div className="bg-primary/15 absolute -top-[15vmin] -left-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full"></div>
        <div className="bg-primary/15 absolute -right-[15vmin] -bottom-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45"></div>
      </div>

      <Image src={logo} className="mb-6 h-32" alt="logo" />

      <div className="z-10 flex w-full max-w-md flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-2 text-2xl font-bold">Select a quizz</h1>
          <div className="w-full space-y-2">
            {quizzList.map((quizz) => (
              <button
                key={quizz.id}
                className={clsx(
                  "flex w-full items-center justify-between rounded-md p-3 outline outline-gray-300",
                  {
                    "border-primary outline-primary outline-2":
                      selected === quizz.id,
                  },
                )}
                onClick={handleSelect(quizz.id)}
              >
                {quizz.subject}

                <div
                  className={clsx(
                    "h-4 w-4 rounded-sm outline-2 outline-gray-300",
                    selected === quizz.id && "bg-primary outline-primary/50",
                  )}
                ></div>
              </button>
            ))}
          </div>
        </div>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </section>
  )
}
