import background from "@rahoot/web/assets/background.webp"
import QuestionEditorAnswers from "@rahoot/web/features/quizz/components/QuestionEditor/QuestionEditorAnswers"
import QuestionEditorConfig from "@rahoot/web/features/quizz/components/QuestionEditor/QuestionEditorConfig"
import QuestionEditorMedia from "@rahoot/web/features/quizz/components/QuestionEditor/QuestionEditorMedia"
import QuestionEditorTitle from "@rahoot/web/features/quizz/components/QuestionEditor/QuestionEditorTitle"
import { useQuizzEditor } from "@rahoot/web/features/quizz/contexts/quizz-editor-context"

const QuestionEditor = () => {
  const { currentQuestion } = useQuizzEditor()

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="mx-auto flex max-w-7xl flex-1 flex-col gap-4 overflow-y-auto p-6">
        <QuestionEditorTitle />
        <QuestionEditorMedia />
        <QuestionEditorAnswers />

        <div className="fixed top-0 left-0 h-full w-full">
          <img
            className="pointer-events-none h-full w-full object-cover select-none"
            src={background}
            alt="background"
          />
        </div>
      </main>
      <QuestionEditorConfig />
    </div>
  )
}

export default QuestionEditor
