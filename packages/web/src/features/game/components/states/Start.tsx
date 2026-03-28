import type { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import { useEvent } from "@rahoot/web/features/game/contexts/socketProvider"
import { SFX_BOUMP_SOUND } from "@rahoot/web/features/game/utils/constants"
import clsx from "clsx"
import { useState } from "react"
import useSound from "use-sound"

type Props = {
  data: CommonStatusDataMap["SHOW_START"]
}

const Start = ({ data: { time, subject } }: Props) => {
  const [showTitle, setShowTitle] = useState(true)
  const [cooldown, setCooldown] = useState(time)

  const [sfxBoump] = useSound(SFX_BOUMP_SOUND, {
    volume: 0.2,
  })

  useEvent("game:startCooldown", () => {
    sfxBoump()
    setShowTitle(false)
  })

  useEvent("game:cooldown", (sec) => {
    sfxBoump()
    setCooldown(sec)
  })

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 text-center">
      {showTitle ? (
        <h2 className="anim-show text-center text-2xl font-bold text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
          {subject}
        </h2>
      ) : (
        <>
          <div
            className={clsx(
              `anim-show bg-primary aspect-square h-24 transition-all sm:h-32 md:h-60`,
            )}
            style={{
              transform: `rotate(${45 * (time - cooldown)}deg)`,
            }}
          ></div>
          <span className="absolute text-5xl font-bold text-white drop-shadow-md sm:text-6xl md:text-8xl">
            {cooldown}
          </span>
        </>
      )}
    </section>
  )
}

export default Start
