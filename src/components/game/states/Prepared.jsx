import { ANSWERS_COLORS, ANSWERS_ICONS } from "@/constants"
import clsx from "clsx"
import { createElement } from "react"

export default function Prepared({ data: { totalAnswers, questionNumber } }) {
  return (
    <section className="anim-show relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      <h2 className="anim-show mb-20 text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
        Question #{questionNumber}
      </h2>
      <div className="anim-quizz grid aspect-square w-60 grid-cols-2 gap-4 rounded-2xl bg-gray-700 p-5 md:w-60">
        {[...Array(totalAnswers)].map((_, key) => (
          <div
            key={key}
            className={clsx(
              "button shadow-inset flex aspect-square h-full w-full items-center justify-center rounded-2xl",
              ANSWERS_COLORS[key],
            )}
          >
            {createElement(ANSWERS_ICONS[key], { className: "h-10 md:h-14" })}
          </div>
        ))}
      </div>
    </section>
  )
}
