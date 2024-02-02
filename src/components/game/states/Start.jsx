import { useSocketContext } from "@/context/socket"
import clsx from "clsx"
import { useEffect, useState } from "react"

export default function Start({ data: { time, subject } }) {
  const { socket } = useSocketContext()
  const [showTitle, setShowTitle] = useState(true)
  const [cooldown, setCooldown] = useState(time)

  useEffect(() => {
    socket.on("game:startCooldown", () => {
      setShowTitle(false)
    })

    socket.on("game:cooldown", (sec) => {
      setCooldown(sec)
    })

    return () => {
      socket.off("game:startCooldown")
      socket.off("game:cooldown")
    }
  }, [])

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      {showTitle ? (
        <h2 className="anim-show text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          {subject}
        </h2>
      ) : (
        <>
          <div
            className={clsx(
              `anim-show aspect-square h-32 bg-primary transition-all md:h-60`,
            )}
            style={{
              transform: `rotate(${45 * (time - cooldown)}deg)`,
            }}
          ></div>
          <span className="absolute text-6xl font-bold text-white drop-shadow-md md:text-8xl">
            {cooldown}
          </span>
        </>
      )}
    </section>
  )
}
