import QuestionEditor from "@rahoot/web/features/quizz/components/QuestionEditor"
import QuizzEditorHeader from "@rahoot/web/features/quizz/components/QuizzEditorHeader"
import QuizzEditorSidebar from "@rahoot/web/features/quizz/components/QuizzEditorSidebar"
import { QuizzEditorProvider } from "@rahoot/web/features/quizz/contexts/quizz-editor-context"
import { createFileRoute } from "@tanstack/react-router"

const QuizzEditorPage = () => (
  <QuizzEditorProvider>
    <div className="relative flex h-svh flex-col bg-gray-50">
      <QuizzEditorHeader />
      <div className="flex flex-1 overflow-hidden">
        <QuizzEditorSidebar />
        <QuestionEditor />
      </div>
    </div>
  </QuizzEditorProvider>
)

export const Route = createFileRoute("/manager/quizz/")({
  component: QuizzEditorPage,
})
