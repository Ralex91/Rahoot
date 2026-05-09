import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd"
import Button from "@razzia/web/components/Button"
import QuizzEditorCard from "@razzia/web/features/quizz/components/QuizzEditorCard"
import { useQuizzEditor } from "@razzia/web/features/quizz/contexts/quizz-editor-context"
import clsx from "clsx"
import { Plus } from "lucide-react"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

const QuizzEditorSidebar = () => {
  const {
    questions,
    currentIndex,
    setCurrentIndex,
    addQuestion,
    removeQuestion,
    reorderQuestions,
  } = useQuizzEditor()
  const { t } = useTranslation()

  const isDragging = useRef(false)

  const handleSlideClick = (index: number) => () => {
    if (!isDragging.current) {
      setCurrentIndex(index)
    }
  }

  const handleDelete = (index: number) => () => {
    removeQuestion(index)
  }

  const handleDragEnd = (result: DropResult) => {
    isDragging.current = false

    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return
    }

    reorderQuestions(result.source.index, result.destination.index)
  }

  return (
    <aside className="z-10 m-3 flex w-72 shrink-0 flex-col gap-2 overflow-auto rounded-xl bg-white p-3 shadow-sm">
      <DragDropContext
        onDragStart={() => {
          isDragging.current = true
        }}
        onDragEnd={handleDragEnd}
      >
        <Droppable droppableId="questions">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-2"
            >
              {questions.map((q, index) => (
                <Draggable key={q.id} draggableId={q.id} index={index}>
                  {(draggableProvided, snapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      className={clsx(snapshot.isDragging && "shadow-lg")}
                    >
                      <QuizzEditorCard
                        question={q}
                        index={index}
                        isActive={currentIndex === index}
                        canDelete={questions.length > 1}
                        onClick={handleSlideClick(index)}
                        onDelete={handleDelete(index)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        onClick={addQuestion}
        className="bg text-md mt-1 mb-8 flex items-center justify-center gap-1 bg-gray-200 text-gray-600"
      >
        <Plus className="size-6" />
        {t("quizz:addQuestion")}
      </Button>
    </aside>
  )
}

export default QuizzEditorSidebar
