"use client"

import { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import { SFX_SHOW_SOUND } from "@rahoot/web/utils/constants"
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
        <h2 className="anim-show text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          {question}
        </h2>

        {Boolean(image) && (
          <img
            alt={question}
            src={image}
            className="m-4 h-full max-h-[400px] min-h-[200px] w-auto rounded-md"
          />
        )}
      </div>
      <div
        className="bg-primary mb-20 h-4 self-start justify-self-end rounded-full"
        style={{ animation: `progressBar ${cooldown}s linear forwards` }}
      ></div>
    </section>
  )
}

export default Question
