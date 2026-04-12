import {
  ANSWERS_COLORS,
  ANSWERS_ICONS,
} from "@rahoot/web/features/game/utils/constants"
import { useResultModal } from "@rahoot/web/features/manager/contexts/result-modal-context"
import clsx from "clsx"
import { Check, X } from "lucide-react"

const ResultModalTable = () => {
  const { questionResult, getPlayerPoints } = useResultModal()

  return (
    <table className="w-full text-sm">
      <thead className="sticky top-0 shadow-sm">
        <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
          <th className="px-5 py-2.5">Player</th>
          <th className="px-4 py-2.5">Answered</th>
          <th className="px-4 py-2.5">Correct / Incorrect</th>
          <th className="px-4 py-2.5 text-right">Points</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {questionResult.playerAnswers.map((pa, i) => {
          const isCorrect =
            pa.answerId !== null &&
            questionResult.solutions.includes(pa.answerId)
          const AnswerIcon =
            pa.answerId !== null ? ANSWERS_ICONS[pa.answerId % 4] : null

          return (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-5 py-2.5 font-medium">{pa.playerName}</td>
              <td className="px-4 py-2.5">
                {pa.answerId !== null && AnswerIcon ? (
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-white",
                      ANSWERS_COLORS[pa.answerId % 4],
                    )}
                  >
                    <AnswerIcon className="size-3" />
                    <span className="max-w-30 truncate">
                      {questionResult.answers[pa.answerId]}
                    </span>
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-2.5">
                {isCorrect ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="size-3.5" /> Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-500">
                    <X className="size-3.5" /> Incorrect
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 text-right font-semibold text-gray-700">
                {getPlayerPoints(pa.playerName)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ResultModalTable
