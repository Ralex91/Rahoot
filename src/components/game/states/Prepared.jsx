import Circle from "@/components/icons/Circle"
import Rhombus from "@/components/icons/Rhombus"
import Square from "@/components/icons/Square"
import Triangle from "@/components/icons/Triangle"

export default function Prepared({ data: { totalAnswers, questionNumber } }) {
  return (
    <section className="anim-show relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      <h2 className="anim-show mb-10 text-center text-2xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
        Question #{questionNumber}
      </h2>
      <div className="anim-quizz grid h-[300px] w-60 grid-cols-2 gap-4 rounded-2xl bg-gray-700 p-5 md:h-[400px] md:w-80 ">
        <div className="button shadow-inset flex aspect-square h-full w-full items-center justify-center rounded-2xl bg-red-500">
          <Triangle className="h-10 md:h-14" />
        </div>
        <div className="button shadow-inset flex aspect-square h-full w-full items-center justify-center rounded-2xl bg-blue-500">
          <Rhombus className="h-10 md:h-14" />
        </div>
        <div className="button shadow-inset flex aspect-square h-full w-full items-center justify-center rounded-2xl bg-yellow-500">
          <Square className="h-10 md:h-14" />
        </div>
        <div className="button shadow-inset flex aspect-square h-full w-full items-center justify-center rounded-2xl bg-green-500">
          <Circle className="h-10 md:h-14" />
        </div>
      </div>
    </section>
  )
}
