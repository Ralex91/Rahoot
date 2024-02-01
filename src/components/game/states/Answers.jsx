import Circle from "@/components/icons/Circle"
import Triangle from "@/components/icons/Triangle"
import Square from "@/components/icons/Square"
import Rhombus from "@/components/icons/Rhombus"
import AnswerButton from "../../AnswerButton"
import { useSocketContext } from "@/context/socket"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"

const answersColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-green-500",
]

const answersIcons = [Triangle, Rhombus, Circle, Square]

const calculatePercentages = (objectResponses) => {
  const keys = Object.keys(objectResponses)
  const values = Object.values(objectResponses)

  if (!values.length) {
    return []
  }

  const totalSum = values.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  )

  let result = {}

  keys.map((key) => {
    result[key] = ((objectResponses[key] / totalSum) * 100).toFixed() + "%"
  })

  console.log(result)

  return result
}

export default function Answers({
  data: { question, answers, image, time, responses, correct },
}) {
  const { socket } = useSocketContext()

  const [percentages, setPercentages] = useState([])
  const [cooldown, setCooldown] = useState(time)
  const [totalAnswer, setTotalAnswer] = useState(0)

  useEffect(() => {
    if (!responses) {
      return
    }

    setPercentages(calculatePercentages(responses))
  }, [responses])

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

        {responses && (
          <div
            className={`w-full gap-4 grid grid-cols-${answers.length} px-2 max-w-3xl h-40 mt-8`}
          >
            {answers.map((_, key) => (
              <div
                key={key}
                className={clsx(
                  "flex flex-col rounded-md overflow-hidden self-end justify-end",
                  answersColors[key]
                )}
                style={{ height: percentages[key] }}
              >
                <span className="text-white font-bold drop-shadow-md text-lg bg-black/10 w-full text-center">
                  {responses[key] || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {!responses && (
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
        )}

        <div className="max-w-7xl mx-auto mb-4 rounded-full w-full grid grid-cols-2 gap-1 font-bold text-white text-lg md:text-xl px-2">
          {answers.map((answer, key) => (
            <AnswerButton
              key={key}
              className={clsx(answersColors[key], {
                "opacity-65": responses && correct !== key,
              })}
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
