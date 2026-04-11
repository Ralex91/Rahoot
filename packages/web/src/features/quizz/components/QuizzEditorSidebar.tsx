import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd"
import Button from "@rahoot/web/components/Button"
import QuizzEditorCard from "@rahoot/web/features/quizz/components/QuizzEditorCard"
import { useQuizzEditor } from "@rahoot/web/features/quizz/contexts/quizz-editor-context"
import clsx from "clsx"
import { Plus } from "lucide-react"
import { useRef } from "react"

const QuizzEditorSidebar = () => {
  const {
    questions,
    currentIndex,
    setCurrentIndex,
    addQuestion,
    removeQuestion,
    reorderQuestions,
  } = useQuizzEditor()

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
    <aside className="z-10 flex w-72 shrink-0 flex-col gap-2 overflow-auto bg-white p-3 shadow-sm">
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
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
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
        className="mt-1 mb-8 flex items-center justify-center gap-1"
      >
        <Plus className="size-6" />
        Add question
      </Button>
    </aside>
  )
}

export default QuizzEditorSidebar
