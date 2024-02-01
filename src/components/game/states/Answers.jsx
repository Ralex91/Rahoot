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
    0,
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
    <div className="flex h-full flex-1 flex-col justify-between">
      <div className="mx-auto inline-flex h-full w-full max-w-7xl flex-1 flex-col items-center justify-center gap-5">
        <h2 className="text-center text-2xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          {question}
        </h2>

        {/*<Image src={image} className="h-60 w-auto rounded-md" />*/}

        {responses && (
          <div
            className={`grid w-full gap-4 grid-cols-${answers.length} mt-8 h-40 max-w-3xl px-2`}
          >
            {answers.map((_, key) => (
              <div
                key={key}
                className={clsx(
                  "flex flex-col justify-end self-end overflow-hidden rounded-md",
                  answersColors[key],
                )}
                style={{ height: percentages[key] }}
              >
                <span className="w-full bg-black/10 text-center text-lg font-bold text-white drop-shadow-md">
                  {responses[key] || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {!responses && (
          <div className="mx-auto mb-4 flex w-full max-w-7xl justify-between gap-1 px-2 text-lg font-bold text-white md:text-xl">
            <div className="flex flex-col items-center rounded-full bg-black/40 px-4 text-lg font-bold">
              <span className="translate-y-1 text-sm">Time</span>
              <span>{cooldown}</span>
            </div>
            <div className="flex flex-col items-center rounded-full bg-black/40 px-4 text-lg font-bold">
              <span className="translate-y-1 text-sm">Answers</span>
              <span>{totalAnswer}</span>
            </div>
          </div>
        )}

        <div className="mx-auto mb-4 grid w-full max-w-7xl grid-cols-2 gap-1 rounded-full px-2 text-lg font-bold text-white md:text-xl">
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
