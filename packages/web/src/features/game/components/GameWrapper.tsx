import type { Status } from "@mindbuzz/common/types/game/status"
import background from "@mindbuzz/web/assets/background.webp"
import Button from "@mindbuzz/web/features/game/components/Button"
import Loader from "@mindbuzz/web/features/game/components/Loader"
import {
  useEvent,
  useSocket,
} from "@mindbuzz/web/features/game/contexts/socketProvider"
import { usePlayerStore } from "@mindbuzz/web/features/game/stores/player"
import { useQuestionStore } from "@mindbuzz/web/features/game/stores/question"
import { MANAGER_SKIP_BTN } from "@mindbuzz/web/features/game/utils/constants"
import clsx from "clsx"
import { type PropsWithChildren, useEffect, useState } from "react"
import toast from "react-hot-toast"

type Props = PropsWithChildren & {
  statusName: Status | undefined
  onNext?: () => void
  manager?: boolean
}

const GameWrapper = ({ children, statusName, onNext, manager }: Props) => {
  const { isConnected } = useSocket()
  const { player } = usePlayerStore()
  const { questionStates, setQuestionStates } = useQuestionStore()
  const [isDisabled, setIsDisabled] = useState(false)
  const next = statusName ? MANAGER_SKIP_BTN[statusName] : null

  useEvent("game:updateQuestion", ({ current, total }) => {
    setQuestionStates({
      current,
      total,
    })
  })

  useEvent("game:errorMessage", (message) => {
    toast.error(message)
    setIsDisabled(false)
  })

  useEffect(() => {
    setIsDisabled(false)
  }, [statusName])

  const handleNext = () => {
    setIsDisabled(true)
    onNext?.()
  }

  return (
    <section className="relative min-h-dvh flex">
      <div className="fixed top-0 left-0 h-full w-full">
        <img
          className="pointer-events-none h-full w-full object-cover"
          src={background}
          alt="background"
        />
      </div>

      <div className="z-10 flex flex-1 w-full flex-col justify-between">
        {!isConnected && !statusName ? (
          <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
            <Loader className="h-30" />
            <h1 className="px-4 text-center text-3xl font-bold text-white md:text-4xl">
              Connecting...
            </h1>
          </div>
        ) : (
          <>
            <div className="flex w-full items-start justify-between gap-3 p-3 sm:p-4">
              {questionStates && (
                <div className="shadow-inset flex items-center rounded-md bg-white px-3 py-2 text-base font-bold text-black sm:px-4 sm:text-lg">
                  {`${questionStates.current} / ${questionStates.total}`}
                </div>
              )}

              {manager && next && (
                <Button
                  className={clsx("self-end bg-white px-4 !text-black", {
                    "pointer-events-none": isDisabled,
                  })}
                  onClick={handleNext}
                >
                  {next}
                </Button>
              )}
            </div>

            {children}

            {!manager && (
              <div className="z-50 flex items-center justify-between gap-3 bg-white px-3 py-2 text-base font-bold text-white sm:px-4 sm:text-lg">
                <p className="min-w-0 truncate text-gray-800">{player?.username}</p>
                <div className="shrink-0 rounded-sm bg-gray-800 px-3 py-1 text-base sm:text-lg">
                  {player?.points}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default GameWrapper

