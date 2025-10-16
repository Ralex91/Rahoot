"use client"

import { Status } from "@rahoot/common/types/game/status"
import GameWrapper from "@rahoot/web/components/game/GameWrapper"
import Answers from "@rahoot/web/components/game/states/Answers"
import Prepared from "@rahoot/web/components/game/states/Prepared"
import Question from "@rahoot/web/components/game/states/Question"
import Result from "@rahoot/web/components/game/states/Result"
import Start from "@rahoot/web/components/game/states/Start"
import Wait from "@rahoot/web/components/game/states/Wait"
import { useEvent } from "@rahoot/web/contexts/socketProvider"
import { usePlayerGameStore } from "@rahoot/web/stores/game"
import { usePlayerStore } from "@rahoot/web/stores/player"
import { GAME_STATE_COMPONENTS } from "@rahoot/web/utils/constants"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function Game() {
  const router = useRouter()
  const { player, logout } = usePlayerStore()
  const { status, setStatus, resetStatus } = usePlayerGameStore()

  useEffect(() => {
    if (!player) {
      router.replace("/")
    }
  }, [player, router])

  useEvent("game:status", ({ name, data }) => {
    if (name in GAME_STATE_COMPONENTS) {
      setStatus(name, data)
    }
  })

  useEvent("game:reset", () => {
    router.replace("/")
    logout()
    resetStatus()
    toast("The game has been reset by the host")
  })

  let component = null

  switch (status.name) {
    case Status.WAIT:
      component = <Wait data={status.data} />

      break

    case Status.SHOW_START:
      component = <Start data={status.data} />

      break

    case Status.SHOW_PREPARED:
      component = <Prepared data={status.data} />

      break

    case Status.SHOW_QUESTION:
      component = <Question data={status.data} />

      break

    case Status.SHOW_RESULT:
      component = <Result data={status.data} />

      break

    case Status.SELECT_ANSWER:
      component = <Answers data={status.data} />

      break
  }

  return <GameWrapper>{component}</GameWrapper>
}
