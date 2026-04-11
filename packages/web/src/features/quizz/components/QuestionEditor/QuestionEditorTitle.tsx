import { useQuizzEditor } from "@rahoot/web/features/quizz/contexts/quizz-editor-context"
import type { ChangeEvent } from "react"

const QuestionEditorTitle = () => {
  const { updateQuestion, currentIndex, currentQuestion } = useQuizzEditor()

  const handleChangeQuestion = (e: ChangeEvent<HTMLInputElement>) => {
    updateQuestion(currentIndex, { question: e.target.value })
  }

  return (
    <div className="z-10 rounded-sm bg-white shadow-sm">
      <input
        className="w-full resize-none p-4 text-center text-xl font-semibold text-gray-800 outline-none placeholder:text-gray-400"
        placeholder="Start typing your question..."
        value={currentQuestion.question}
        onChange={handleChangeQuestion}
      />
    </div>
  )
}

export default QuestionEditorTitle
