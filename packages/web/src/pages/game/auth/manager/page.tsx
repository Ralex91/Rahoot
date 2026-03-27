import type { QuizzWithId } from "@rahoot/common/types/game"
import { STATUS } from "@rahoot/common/types/game/status"
import ManagerPassword from "@rahoot/web/features/game/components/create/ManagerPassword"
import SelectQuizz from "@rahoot/web/features/game/components/create/SelectQuizz"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/features/game/stores/manager"
import { useState } from "react"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"

const ManagerAuthPage = () => {
  const { setGameId, setStatus } = useManagerStore()
  const navigate = useNavigate()
  const { socket } = useSocket()

  const [isAuth, setIsAuth] = useState(false)
  const [quizzList, setQuizzList] = useState<QuizzWithId[]>([])

  useEvent("manager:quizzList", (quizzList) => {
    setIsAuth(true)
    setQuizzList(quizzList)
  })

  useEvent("manager:quizzDeleted", (quizzId) => {
    setQuizzList((current) => current.filter((quizz) => quizz.id !== quizzId))
    toast.success("Quiz deleted")
  })

  useEvent("manager:gameCreated", ({ gameId, inviteCode }) => {
    setGameId(gameId)
    setStatus(STATUS.SHOW_ROOM, { text: "Waiting for the players", inviteCode })
    navigate(`/party/manager/${gameId}`)
  })

  const handleAuth = (password: string) => {
    socket?.emit("manager:auth", password)
  }
  const handleCreate = (quizzId: string) => {
    socket?.emit("game:create", quizzId)
  }

  const handleCreateQuizz = (subject: string) => {
    socket?.emit("manager:createQuizz", { subject })
  }

  const handleDeleteQuizz = (quizzId: string) => {
    socket?.emit("manager:deleteQuizz", { quizzId })
  }

  if (!isAuth) {
    return <ManagerPassword onSubmit={handleAuth} />
  }

  return (
    <SelectQuizz
      quizzList={quizzList}
      onCreate={handleCreateQuizz}
      onDelete={handleDeleteQuizz}
      onSelect={handleCreate}
    />
  )
}

export default ManagerAuthPage
