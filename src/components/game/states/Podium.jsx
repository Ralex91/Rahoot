import Loader from "@/components/Loader"
import clsx from "clsx"
import { useEffect, useState } from "react"

export default function Podium({ data: { subject, top } }) {
  const [apparition, setApparition] = useState(0)

  useEffect(() => {
    if (top.length < 3) {
      setApparition(4)
    }

    const interval = setInterval(() => {
      if (apparition > 4) {
        clearInterval(interval)
        return
      }
      setApparition((value) => value + 1)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-between">
      <h2 className="anim-show text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
        {subject}
      </h2>

      <div
        className={`grid max-w-[500px] flex-1 grid-cols-${top.length} w-full items-end justify-center justify-self-end overflow-x-visible`}
      >
        {top[1] && (
          <div
            className={clsx(
              "z-20 flex h-[50%] w-full flex-col items-center justify-center gap-3 opacity-0",
              { "opacity-100": apparition >= 2 },
            )}
          >
            <p className="overflow-visible whitespace-nowrap text-center text-2xl font-bold text-white drop-shadow-lg">
              {top[1].username}
            </p>
            <div className="flex h-full w-full flex-col items-center gap-4 rounded-t-md bg-primary pt-6 text-center shadow-2xl">
              <p className="flex aspect-square h-14 items-center justify-center rounded-full border-4 border-zinc-400 bg-zinc-500 text-3xl font-bold text-white drop-shadow-lg">
                <span className="drop-shadow-md">2</span>
              </p>
              <p className="text-2xl font-bold text-white drop-shadow-lg">
                {top[1].points}
              </p>
            </div>
          </div>
        )}

        <div
          className={clsx(
            "z-30 flex h-[60%] w-full flex-col items-center gap-3 opacity-0",
            {
              "opacity-100": apparition >= 3,
            },
            {
              "md:min-w-64": top.length < 2,
            },
          )}
        >
          <p
            className={clsx(
              "overflow-visible whitespace-nowrap text-center text-2xl font-bold text-white opacity-0 drop-shadow-lg",
              { "opacity-100": apparition >= 4 },
            )}
          >
            {top[0].username}
          </p>
          <div className="flex h-full w-full flex-col items-center gap-4 rounded-t-md bg-primary pt-6 text-center shadow-2xl">
            <p className="flex aspect-square h-14 items-center justify-center rounded-full border-4 border-amber-400 bg-amber-300 text-3xl font-bold text-white drop-shadow-lg">
              <span className="drop-shadow-md">1</span>
            </p>
            <p className="text-2xl font-bold text-white drop-shadow-lg">
              {top[0].points}
            </p>
          </div>
        </div>

        {top[2] && (
          <div
            className={clsx(
              "z-10 flex h-[40%] w-full flex-col items-center gap-3 opacity-0",
              {
                "opacity-100": apparition >= 1,
              },
            )}
          >
            <p className="overflow-visible whitespace-nowrap text-center text-2xl font-bold text-white drop-shadow-lg">
              {top[2].username}
            </p>
            <div className="flex h-full w-full flex-col items-center gap-4 rounded-t-md bg-primary pt-6 text-center shadow-2xl">
              <p className="flex aspect-square h-14 items-center justify-center rounded-full border-4 border-amber-800 bg-amber-700 text-3xl font-bold text-white drop-shadow-lg">
                <span className="drop-shadow-md">3</span>
              </p>

              <p className="text-2xl font-bold text-white drop-shadow-lg">
                {top[2].points}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
