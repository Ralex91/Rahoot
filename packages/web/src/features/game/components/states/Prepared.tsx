import type { CommonStatusDataMap } from "@mindbuzz/common/types/game/status"
import {
  ANSWERS_COLORS,
  ANSWERS_ICONS,
} from "@mindbuzz/web/features/game/utils/constants"
import clsx from "clsx"
import { createElement } from "react"

type Props = {
  data: CommonStatusDataMap["SHOW_PREPARED"]
}

const Prepared = ({ data: { totalAnswers, questionNumber } }: Props) => (
  <section className="anim-show relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 text-center">
    <h2 className="anim-show mb-10 text-center text-2xl font-bold text-white drop-shadow-lg sm:mb-20 sm:text-3xl md:text-4xl lg:text-5xl">
      Question #{questionNumber}
    </h2>
    <div className="anim-quizz grid aspect-square w-44 grid-cols-2 gap-3 rounded-2xl bg-gray-700 p-4 sm:w-52 sm:gap-4 sm:p-5 md:w-60">
      {[...Array(totalAnswers)].map((_, key) => (
        <div
          key={key}
          className={clsx(
            "button shadow-inset flex aspect-square h-full w-full items-center justify-center rounded-2xl",
            ANSWERS_COLORS[key],
          )}
        >
          {createElement(ANSWERS_ICONS[key], {
            className: "h-8 sm:h-10 md:h-14",
          })}
        </div>
      ))}
    </div>
  </section>
)

export default Prepared

