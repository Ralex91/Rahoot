import CricleCheck from "@/components/icons/CricleCheck"
import CricleXmark from "@/components/icons/CricleXmark"
import { SFX_RESULTS_SOUND } from "@/constants"
import { usePlayerContext } from "@/context/player"
import { useEffect } from "react"
import useSound from "use-sound"

export default function Result({
  data: { correct, message, points, myPoints, totalPlayer, rank, aheadOfMe },
}) {
  const { dispatch } = usePlayerContext()

  const [sfxResults] = useSound(SFX_RESULTS_SOUND, {
    volume: 0.2,
  })

  useEffect(() => {
    dispatch({
      type: "UPDATE",
      payload: { points: myPoints },
    })

    sfxResults()
  }, [sfxResults])

  return (
    <section className="anim-show relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
      {correct ? (
        <CricleCheck className="aspect-square max-h-60 w-full" />
      ) : (
        <CricleXmark className=" aspect-square max-h-60 w-full" />
      )}
      <h2 className="mt-1 text-4xl font-bold text-white drop-shadow-lg">
        {message}
      </h2>
      <p className="mt-1 text-xl font-bold text-white drop-shadow-lg">
        {`You are top ${rank}` + (aheadOfMe ? ", behind " + aheadOfMe : "")}
      </p>
      {correct && (
        <span className="mt-2 rounded bg-black/40 px-4 py-2 text-2xl font-bold text-white drop-shadow-lg">
          +{points}
        </span>
      )}
    </section>
  )
}
