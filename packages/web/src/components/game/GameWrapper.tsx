"use client"

import { GameUpdateQuestion } from "@rahoot/common/types/game"
import background from "@rahoot/web/assets/background.webp"
import Button from "@rahoot/web/components/Button"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@rahoot/web/stores/player"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useEffect, useState } from "react"

type Props = PropsWithChildren & {
  textNext?: string
  onNext?: () => void
  manager?: boolean
}

export default function GameWrapper({
  children,
  textNext,
  onNext,
  manager,
}: Props) {
  const { isConnected, connect } = useSocket()
  const { player, logout } = usePlayerStore()
  const router = useRouter()

  const [questionState, setQuestionState] = useState<GameUpdateQuestion>()

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  useEvent("game:kick", () => {
    logout()
    router.replace("/")
  })

  useEvent("game:updateQuestion", ({ current, total }) => {
    setQuestionState({
      current,
      total,
    })
  })

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-between">
      <div className="fixed top-0 left-0 -z-10 h-full w-full bg-orange-600 opacity-70">
        <Image
          className="pointer-events-none h-full w-full object-cover opacity-60"
          src={background}
          alt="background"
        />
      </div>

      <div className="flex w-full justify-between p-4">
        {questionState && (
          <div className="shadow-inset flex items-center rounded-md bg-white p-2 px-4 text-lg font-bold text-black">
            {`${questionState.current} / ${questionState.total}`}
          </div>
        )}

        {manager && (
          <Button
            className="self-end bg-white px-4 !text-black"
            onClick={onNext}
          >
            {textNext}
          </Button>
        )}
      </div>

      {children}

      {!manager && (
        <div className="z-50 flex items-center justify-between bg-white px-4 py-2 text-lg font-bold text-white">
          <p className="text-gray-800">{player?.username}</p>
          <div className="rounded-sm bg-gray-800 px-3 py-1 text-lg">
            {player?.points}
          </div>
        </div>
      )}
    </section>
  )
}
