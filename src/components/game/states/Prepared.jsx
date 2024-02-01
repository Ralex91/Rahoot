import Circle from "@/components/icons/Circle"
import CricleCheck from "@/components/icons/CricleCheck"
import CricleXmark from "@/components/icons/CricleXmark"
import Rhombus from "@/components/icons/Rhombus"
import Square from "@/components/icons/Square"
import Triangle from "@/components/icons/Triangle"
import { usePlayerContext } from "@/context/player"
import { useEffect } from "react"
/*{ data: { number, total, question } }*/
export default function Prepared() {
  const { dispatch } = usePlayerContext()

  return (
    <section className="max-w-7xl mx-auto w-full flex-1 relative items-center justify-center flex flex-col anim-show">
      <div className="anim-quizz bg-gray-700 p-5 gap-4 rounded-2xl w-80 h-[400px] grid grid-cols-2 shadow-[10px_10px_0_rgba(20,24,29,1)] ">
        <div className="button flex justify-center items-center bg-red-500 w-full h-full aspect-square shadow-inset rounded-2xl">
          <Triangle className="h-14" />
        </div>
        <div className="button flex justify-center items-center bg-blue-500 w-full h-full aspect-square shadow-inset rounded-2xl">
          <Rhombus className="h-14" />
        </div>
        <div className="button flex justify-center items-center bg-yellow-500 w-full h-full aspect-square shadow-inset rounded-2xl">
          <Square className="h-14" />
        </div>
        <div className="button flex justify-center items-center bg-green-500 w-full h-full aspect-square shadow-inset rounded-2xl">
          <Circle className="h-14" />
        </div>
      </div>
    </section>
  )
}
