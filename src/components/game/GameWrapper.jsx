import Image from "next/image"
import Button from "@/components/Button"
import background from "@/assets/2238431_1694.jpg"
import { usePlayerContext } from "@/context/player"
import { useSocketContext } from "@/context/socket"
import { useState } from "react"

export default function GameWrapper({ children, onNext, manager }) {
  const { socket } = useSocketContext()
  const { player } = usePlayerContext()

  const [questionState, setQuestionState] = useState()

  socket.on("game:updateQuestion", ({ current, total }) => {
    setQuestionState({
      current,
      total,
    })
  })

  return (
    <section className="relative flex justify-between flex-col w-full min-h-screen">
      <div className="fixed h-full w-full top-0 left-0 bg-orange-600 opacity-70 -z-10">
        <Image
          className="object-cover h-full w-full opacity-60 pointer-events-none"
          src={background}
        />
      </div>

      <div className="p-4 w-full flex justify-between">
        {questionState && (
          <div className="bg-white shadow-inset text-black px-4 font-bold rounded-md flex items-center text-lg">
            {`${questionState.current} / ${questionState.total}`}
          </div>
        )}

        {manager && (
          <Button
            className="bg-white !text-black px-4 self-end"
            onClick={() => onNext()}
          >
            Skip
          </Button>
        )}
      </div>

      {children}

      <div className="bg-white py-2 px-4 flex items-center text-lg justify-between font-bold text-white">
        <p className="text-gray-800">{!!player && player.username}</p>
        <div className="bg-gray-800 rounded-sm py-1 px-3 text-lg">
          {!!player && player.points}
        </div>
      </div>
    </section>
  )
}
