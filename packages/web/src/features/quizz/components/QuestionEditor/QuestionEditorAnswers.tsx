import {
  ANSWERS_COLORS,
  ANSWERS_ICONS,
} from "@rahoot/web/features/game/utils/constants"
import { useQuizzEditor } from "@rahoot/web/features/quizz/contexts/quizz-editor-context"
import clsx from "clsx"
import { Minus, Plus } from "lucide-react"

const Checkmark = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const QuestionEditorAnswers = () => {
  const { currentQuestion, currentIndex, updateQuestion } = useQuizzEditor()

  const updateAnswer = (index: number, value: string) => {
    const next = [...currentQuestion.answers]
    next[index] = value
    updateQuestion(currentIndex, { answers: next })
  }

  const addAnswer = () => {
    if (currentQuestion.answers.length >= 4) {
      return
    }

    updateQuestion(currentIndex, { answers: [...currentQuestion.answers, ""] })
  }

  const removeAnswer = () => {
    if (currentQuestion.answers.length <= 2) {
      return
    }

    const next = currentQuestion.answers.slice(0, -1)
    const maxIndex = next.length - 1
    const nextSolution = currentQuestion.solutions.filter((s) => s <= maxIndex)

    updateQuestion(currentIndex, {
      answers: next,
      solutions: nextSolution.length > 0 ? nextSolution : [0],
    })
  }

  const toggleSolution = (index: number) => {
    const current = currentQuestion.solutions

    if (current.includes(index)) {
      const next = current.filter((s) => s !== index)
      updateQuestion(currentIndex, {
        solutions: next.length > 0 ? next : [index],
      })
    } else {
      updateQuestion(currentIndex, { solutions: [...current, index] })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-gray-500">
          {currentQuestion.answers.length} answers
        </span>
        <div className="flex gap-2">
          <button
            onClick={removeAnswer}
            disabled={currentQuestion.answers.length <= 2}
            className="flex size-7 items-center justify-center rounded bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <button
            onClick={addAnswer}
            disabled={currentQuestion.answers.length >= 4}
            className="flex size-7 items-center justify-center rounded bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.answers.map((answer, i) => {
          const Icon = ANSWERS_ICONS[i]
          const isSelected = currentQuestion.solutions.includes(i)

          return (
            <div
              key={i}
              className={clsx(
                "shadow-inset flex items-center gap-3 rounded px-4 py-6",
                ANSWERS_COLORS[i],
              )}
            >
              <Icon className="h-6 w-6 shrink-0 fill-white" />
              <span className="flex w-full items-center justify-between gap-1.5 drop-shadow-md">
                <input
                  className="min-w-0 flex-1 bg-transparent font-semibold text-white placeholder-white/70 outline-none"
                  placeholder="Add an answer..."
                  value={answer}
                  onChange={(e) => updateAnswer(i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => toggleSolution(i)}
                  className={clsx(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isSelected
                      ? "border-white bg-white text-green-600"
                      : "border-white/60 bg-transparent",
                  )}
                >
                  {isSelected && <Checkmark />}
                </button>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QuestionEditorAnswers
