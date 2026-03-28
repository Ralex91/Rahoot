import type { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import AnswerButton from "@rahoot/web/features/game/components/AnswerButton"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/features/game/stores/player"
import {
  ANSWERS_COLORS,
  ANSWERS_ICONS,
  SFX_ANSWERS_MUSIC,
  SFX_ANSWERS_SOUND,
} from "@rahoot/web/features/game/utils/constants"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import useSound from "use-sound"

type Props = {
  data: CommonStatusDataMap["SELECT_ANSWER"]
}

const Answers = ({
  data: { question, answers, image, audio, video, time, totalPlayer },
}: Props) => {
  const { gameId }: { gameId?: string } = useParams()
  const { socket } = useSocket()
  const { player } = usePlayerStore()

  const [cooldown, setCooldown] = useState(time)
  const [totalAnswer, setTotalAnswer] = useState(0)

  const [sfxPop] = useSound(SFX_ANSWERS_SOUND, {
    volume: 0.1,
  })

  const [playMusic, { stop: stopMusic }] = useSound(SFX_ANSWERS_MUSIC, {
    volume: 0.2,
    interrupt: true,
    loop: true,
  })

  const handleAnswer = (answerKey: number) => () => {
    if (!player) {
      return
    }

    socket?.emit("player:selectedAnswer", {
      gameId,
      data: {
        answerKey,
      },
    })
    sfxPop()
  }

  useEffect(() => {
    if (video || audio) {
      return
    }

    playMusic()

    // eslint-disable-next-line consistent-return
    return () => {
      stopMusic()
    }
  }, [audio, playMusic, stopMusic, video])

  useEvent("game:cooldown", (sec) => {
    setCooldown(sec)
  })

  useEvent("game:playerAnswer", (count) => {
    setTotalAnswer(count)
    sfxPop()
  })

  return (
    <div className="flex h-full flex-1 flex-col justify-between pb-3 sm:pb-4">
      <div className="mx-auto inline-flex h-full w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-3 sm:gap-5 sm:px-4">
        <h2 className="text-center text-2xl font-bold text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
          {question}
        </h2>

        {Boolean(audio) && !player && (
          <audio
            className="mb-2 w-full max-w-md rounded-md"
            src={audio}
            autoPlay
            controls
          />
        )}

        {Boolean(video) && !player && (
          <video
            className="mb-2 aspect-video max-h-60 w-full max-w-3xl rounded-md sm:max-h-100"
            src={video}
            autoPlay
            controls
          />
        )}

        {Boolean(image) && (
          <img
            alt={question}
            src={image}
            className="mb-2 max-h-60 w-full max-w-3xl rounded-md object-contain sm:max-h-100"
          />
        )}
      </div>

      <div>
        <div className="mx-auto mb-3 flex w-full max-w-7xl justify-between gap-2 px-3 text-base font-bold text-white sm:mb-4 sm:px-4 sm:text-lg md:text-xl">
          <div className="flex min-w-0 flex-col items-center rounded-full bg-black/40 px-3 py-1 text-base font-bold sm:px-4 sm:text-lg">
            <span className="translate-y-1 text-sm">Time</span>
            <span>{cooldown}</span>
          </div>
          <div className="flex min-w-0 flex-col items-center rounded-full bg-black/40 px-3 py-1 text-base font-bold sm:px-4 sm:text-lg">
            <span className="translate-y-1 text-sm">Answers</span>
            <span>
              {totalAnswer}/{totalPlayer}
            </span>
          </div>
        </div>

        <div className="mx-auto mb-1 grid w-full max-w-7xl grid-cols-2 gap-2 px-3 text-lg font-bold text-white sm:mb-4 sm:px-4 md:text-xl">
          {answers.map((answer, key) => (
            <AnswerButton
              key={key}
              className={clsx(ANSWERS_COLORS[key])}
              icon={ANSWERS_ICONS[key]}
              onClick={handleAnswer(key)}
            >
              {answer}
            </AnswerButton>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Answers
