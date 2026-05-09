import type { CommonStatusDataMap } from "@razzia/common/types/game/status"
import {
  ANSWERS_COLORS,
  ANSWERS_LABELS,
} from "@razzia/web/features/game/utils/constants"
import clsx from "clsx"
import { useTranslation } from "react-i18next"

interface Props {
  data: CommonStatusDataMap["SHOW_PREPARED"]
}

const Prepared = ({ data: { totalAnswers, questionNumber } }: Props) => {
  const { t } = useTranslation()

  return (
    <section className="anim-show relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      <h2 className="anim-show mb-20 text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
        {t("game:questionPrefix")}
        {questionNumber}
      </h2>
      <div className="anim-quizz grid aspect-square w-60 grid-cols-2 gap-4 rounded-2xl bg-gray-700 p-5 md:w-60">
        {Array.from({ length: totalAnswers }).map((_, key) => (
          <div
            key={key}
            className={clsx(
              "button shadow-inset flex aspect-square h-full w-full items-center justify-center rounded-2xl",
              ANSWERS_COLORS[key],
            )}
          >
            <span className="text-2xl font-bold text-white md:text-3xl">
              {ANSWERS_LABELS[key]}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Prepared
