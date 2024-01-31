import Circle from "@/components/icons/Circle"
import Triangle from "@/components/icons/Triangle"
import Square from "@/components/icons/Square"
import Rhombus from "@/components/icons/Rhombus"
import AnswerButton from "../../AnswerButton"
import { useSocketContext } from "@/context/socket"
import Image from "next/image"
import { useState } from "react"

const answersColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-green-500",
]

const answersIcons = [Triangle, Rhombus, Circle, Square]

export default function Answers({ data: { question, answers, image, time } }) {
  const { socket } = useSocketContext()

  const [cooldown, setCooldown] = useState(time)
  const [totalAnswer, setTotalAnswer] = useState(0)

  socket.on("game:cooldown", (sec) => {
    setCooldown(sec)
  })

  socket.on("game:playerAnswer", (count) => {
    setTotalAnswer(count)
  })

  return (
    <div className="flex h-full flex-col justify-between flex-1">
      <div className="h-full max-w-7xl mx-auto w-full inline-flex flex-col items-center justify-center gap-5 flex-1">
        <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg text-center">
          {question}
        </h2>

        {/*<Image src={image} className="h-60 w-auto rounded-md" />*/}
      </div>

      <div className="">
        <div className="max-w-7xl mx-auto mb-4 rounded-full w-full flex justify-between gap-1 font-bold text-white text-lg md:text-xl px-2">
          <div className="bg-white shadow-inset text-black px-4 font-bold rounded-md flex flex-col items-center text-lg">
            <span className="text-sm">Time</span>
            <span className="-translate-y-1">{cooldown}</span>
          </div>
          <div className="bg-white shadow-inset text-black px-4 font-bold rounded-md flex flex-col items-center text-lg">
            <span className="text-sm">Answers</span>
            <span className="-translate-y-1">{totalAnswer}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-4 rounded-full w-full grid grid-cols-2 gap-1 font-bold text-white text-lg md:text-xl px-2">
          {answers.map((answer, key) => (
            <AnswerButton
              key={key}
              className={answersColors[key]}
              icon={answersIcons[key]}
              onClick={() => socket.emit("player:selectedAnswer", key)}
            >
              {answer}
            </AnswerButton>
          ))}
        </div>
      </div>
    </div>
  )
}

/* OLD Timer
<div className="absolute left-8 -translate-y-1/2 top-2/4 text-white font-bold text-6xl rounded-full justify-center items-center bg-orange-400 p-8 aspect-square hidden 2xl:flex">
  <span </div>className="drop-shadow-md">20</span>
</div>
*/
