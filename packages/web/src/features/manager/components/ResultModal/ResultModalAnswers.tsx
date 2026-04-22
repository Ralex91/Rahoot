import { MEDIA_TYPES } from "@rahoot/common/constants"
import type { QuestionMedia } from "@rahoot/common/types/game"
import {
  ANSWERS_COLORS,
  ANSWERS_ICONS,
} from "@rahoot/web/features/game/utils/constants"
import { useResultModal } from "@rahoot/web/features/manager/contexts/result-modal-context"
import clsx from "clsx"
import { Check, Clock, ImageOff, Music, Video, X } from "lucide-react"
import type { ComponentType } from "react"
import { useTranslation } from "react-i18next"

type AnswerRow = {
  label: string
  count: number
  isCorrect: boolean
  color: string | null
  Icon: ComponentType<{ className?: string }> | null
}

const MediaPreview = ({ media }: { media?: QuestionMedia }) => {
  if (media?.type === MEDIA_TYPES.IMAGE) {
    return (
      <img
        src={media.url}
        alt=""
        className="h-16 w-auto rounded-md object-contain md:h-full"
      />
    )
  }

  if (media?.type === MEDIA_TYPES.VIDEO) {
    return (
      <div className="flex h-16 w-24 items-center justify-center rounded-md bg-gray-200 md:h-38 md:w-full">
        <Video className="size-6 text-gray-400 md:size-10" />
      </div>
    )
  }

  if (media?.type === MEDIA_TYPES.AUDIO) {
    return (
      <div className="flex h-16 w-24 items-center justify-center rounded-md bg-gray-200 md:h-38 md:w-full">
        <Music className="size-6 text-gray-400 md:size-10" />
      </div>
    )
  }

  return (
    <div className="flex h-16 w-24 items-center justify-center rounded-md bg-gray-200 md:h-38 md:w-full">
      <ImageOff className="size-6 text-gray-400 md:size-10" />
    </div>
  )
}

const ResultModalAnswers = () => {
  const { questionResult, totalPlayers, answeredCount, maxAnswerCount } =
    useResultModal()
  const { t } = useTranslation()

  const noAnswerCount = totalPlayers - answeredCount

  const rows: AnswerRow[] = [
    ...questionResult.answers.map((label, ai) => ({
      label,
      count: questionResult.playerAnswers.filter((pa) => pa.answerId === ai)
        .length,
      isCorrect: questionResult.solutions.includes(ai),
      color: ANSWERS_COLORS[ai % 4],
      Icon: ANSWERS_ICONS[ai % 4],
    })),
    {
      label: t("manager:result.noAnswer"),
      count: noAnswerCount,
      isCorrect: false,
      color: null,
      Icon: null,
    },
  ]

  return (
    <div className="flex flex-col border-b border-gray-100 md:flex-row">
      <div className="flex shrink-0 flex-row items-center gap-4 border-b border-gray-100 bg-gray-50 p-4 md:h-54 md:w-66 md:flex-col md:justify-center md:border-r md:border-b-0">
        <MediaPreview media={questionResult.media} />
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="size-3.5" />
          <span>
            {questionResult.time}
            {t("manager:result.timeLimitSuffix")}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 overflow-hidden px-4 py-3 md:gap-2 md:px-5 md:py-4">
        <p className="mb-1 text-sm font-semibold text-gray-800">
          {questionResult.question}
        </p>

        {rows.map((row, i) => {
          const barWidth =
            maxAnswerCount > 0
              ? Math.round((row.count / maxAnswerCount) * 100)
              : 0

          return (
            <div key={i} className="flex items-center gap-3">
              {row.color && row.Icon ? (
                <div
                  className={clsx(
                    "flex size-6 shrink-0 items-center justify-center rounded",
                    row.color,
                  )}
                >
                  <row.Icon className="size-3" />
                </div>
              ) : (
                <div className="flex size-6 shrink-0 items-center justify-center rounded border border-gray-300 bg-white">
                  <X className="size-3 text-gray-400" />
                </div>
              )}

              <span
                className={clsx("min-w-0 flex-1 truncate text-sm font-medium", {
                  "text-gray-400": !row.color,
                })}
              >
                {row.label}
              </span>

              <span className="w-4 shrink-0">
                {row.isCorrect ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <X
                    className={clsx(
                      "size-4",
                      row.color ? "text-red-500" : "text-red-400",
                    )}
                  />
                )}
              </span>

              <div className="flex w-24 shrink-0 items-center gap-2 md:w-48">
                <div className="h-3 flex-1 overflow-hidden rounded bg-gray-100">
                  <div
                    className={clsx(
                      "h-full rounded transition-all",
                      row.color ?? "bg-gray-300",
                    )}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="w-5 text-right text-sm font-semibold text-gray-600">
                  {row.count}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ResultModalAnswers
