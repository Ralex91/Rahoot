import { MEDIA_TYPES } from "@rahoot/common/constants"
import type { QuestionMedia } from "@rahoot/common/types/game"
import AlertDialog from "@rahoot/web/components/AlertDialog"
import { type QuestionWithId } from "@rahoot/web/features/quizz/contexts/quizz-editor-context"
import clsx from "clsx"
import { Music, Trash2, Video } from "lucide-react"
import { twMerge } from "tailwind-merge"

const SlideMedia = ({ media }: { media?: QuestionMedia }) => {
  if (media?.type === MEDIA_TYPES.IMAGE) {
    return (
      <img src={media.url} className="mx-auto max-h-14 w-auto rounded-xs" />
    )
  }

  if (media?.type === MEDIA_TYPES.VIDEO) {
    return <Video className="mx-auto size-10 text-gray-400" />
  }

  if (media?.type === MEDIA_TYPES.AUDIO) {
    return <Music className="mx-auto size-10 text-gray-400" />
  }

  return null
}

type Props = {
  question: QuestionWithId
  index: number
  isActive: boolean
  canDelete: boolean
  onClick: () => void
  onDelete: () => void
}

const QuizzEditorCard = ({
  question,
  index,
  isActive,
  canDelete,
  onClick,
  onDelete,
}: Props) => (
  <div
    onClick={onClick}
    className={twMerge(
      clsx(
        "group relative flex h-36 cursor-pointer flex-col justify-between gap-1 rounded-sm border-2 border-gray-200 bg-white px-4 py-2",
        {
          "border-primary": isActive,
        },
      ),
    )}
  >
    <span className="absolute top-2 left-2 text-xs font-semibold text-gray-400">
      {index + 1}
    </span>
    <p className="truncate text-center text-xs font-semibold text-gray-700">
      {question.question || "No question yet"}
    </p>

    <SlideMedia media={question.media} />

    <div className="grid grid-cols-2 gap-1">
      {question.answers.map((_, i) => (
        <div
          key={i}
          className="flex h-4 flex-1 items-center border border-gray-300 px-0.5"
        >
          {i === question.solution && (
            <div className="ml-auto size-1.5 rounded-full bg-green-400" />
          )}
        </div>
      ))}
    </div>

    {canDelete && (
      <AlertDialog
        trigger={
          <button
            onClick={(e) => e.stopPropagation()}
            className="absolute top-1.5 right-1.5 hidden rounded-sm p-1 text-gray-400 group-hover:block hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="size-3.5" />
          </button>
        }
        title="Delete question"
        description="Are you sure you want to delete this question?"
        confirmLabel="Delete"
        onConfirm={onDelete}
      />
    )}
  </div>
)

export default QuizzEditorCard
