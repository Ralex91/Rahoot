import type { CommonStatusDataMap } from "@mindbuzz/common/types/game/status"
import { SFX_SHOW_SOUND } from "@mindbuzz/web/features/game/utils/constants"
import { useEffect } from "react"
import useSound from "use-sound"

type Props = {
  data: CommonStatusDataMap["SHOW_QUESTION"]
}

const Question = ({ data: { question, image, cooldown } }: Props) => {
  const [sfxShow] = useSound(SFX_SHOW_SOUND, { volume: 0.5 })

  useEffect(() => {
    sfxShow()
  }, [sfxShow])

  return (
    <section className="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col items-center px-4">
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <h2 className="anim-show text-center text-2xl font-bold text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
          {question}
        </h2>

        {Boolean(image) && (
          <img
            alt={question}
            src={image}
            className="max-h-60 w-full max-w-3xl rounded-md object-contain sm:max-h-100"
          />
        )}
      </div>
      <div
        className="bg-primary mb-6 h-4 self-start justify-self-end rounded-full sm:mb-20"
        style={{ animation: `progressBar ${cooldown}s linear forwards` }}
      ></div>
    </section>
  )
}

export default Question

