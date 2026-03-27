import type {
  Quizz,
  QuizRunHistorySummary,
  QuizzWithId,
} from "@rahoot/common/types/game"
import Button from "@rahoot/web/features/game/components/Button"
import HistoryPanel from "@rahoot/web/features/game/components/create/HistoryPanel"
import QuizzEditor from "@rahoot/web/features/game/components/create/QuizzEditor"
import { STATUS } from "@rahoot/common/types/game/status"
import ManagerPassword from "@rahoot/web/features/game/components/create/ManagerPassword"
import SelectQuizz from "@rahoot/web/features/game/components/create/SelectQuizz"
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/features/game/stores/manager"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"

const downloadCsv = (filename: string, content: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

const ManagerAuthPage = () => {
  const { setGameId, setStatus } = useManagerStore()
  const navigate = useNavigate()
  const { socket } = useSocket()

  const [isAuth, setIsAuth] = useState(false)
  const [history, setHistory] = useState<QuizRunHistorySummary[]>([])
  const [quizzList, setQuizzList] = useState<QuizzWithId[]>([])
  const [editingQuizzId, setEditingQuizzId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"quizzes" | "history">("quizzes")

  useEffect(() => {
    socket?.emit("manager:getDashboard")
  }, [socket])

  useEvent("manager:quizzList", (quizzList) => {
    setIsAuth(true)
    setQuizzList(quizzList)
  })

  useEvent("manager:historyList", (history) => {
    setIsAuth(true)
    setHistory(history)
  })

  useEvent("manager:quizzCreated", (quizz) => {
    setQuizzList((current) => {
      const filtered = current.filter((item) => item.id !== quizz.id)

      return [...filtered, quizz]
    })
    setEditingQuizzId(quizz.id)
    toast.success("Quiz created")
  })

  useEvent("manager:quizzDeleted", (quizzId) => {
    setQuizzList((current) => current.filter((quizz) => quizz.id !== quizzId))
    if (editingQuizzId === quizzId) {
      setEditingQuizzId(null)
    }
    toast.success("Quiz deleted")
  })

  useEvent("manager:quizzUpdated", (quizz) => {
    setQuizzList((current) =>
      current.map((item) => (item.id === quizz.id ? quizz : item)),
    )
    setEditingQuizzId(quizz.id)
    toast.success("Quiz saved")
  })

  useEvent("manager:historyExportReady", ({ filename, content }) => {
    downloadCsv(filename, content)
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

  const handleUpdateQuizz = (quizzId: string, quizz: Quizz) => {
    socket?.emit("manager:updateQuizz", { quizzId, quizz })
  }

  const handleEditQuizz = (quizzId: string) => {
    setActiveTab("quizzes")
    setEditingQuizzId(quizzId)
  }

  if (!isAuth) {
    return <ManagerPassword onSubmit={handleAuth} />
  }

  const editingQuizz = quizzList.find((quizz) => quizz.id === editingQuizzId)

  if (editingQuizz) {
    return (
      <QuizzEditor
        quizz={editingQuizz}
        onBack={() => setEditingQuizzId(null)}
        onSave={handleUpdateQuizz}
      />
    )
  }

  return (
    <div className="z-10 flex w-full max-w-5xl flex-col gap-4">
      <div className="flex gap-2 self-start rounded-md bg-white p-2 shadow-sm">
        <Button
          className={activeTab === "quizzes" ? "px-4" : "bg-white px-4 text-black!"}
          onClick={() => setActiveTab("quizzes")}
        >
          Quizzes
        </Button>
        <Button
          className={activeTab === "history" ? "px-4" : "bg-white px-4 text-black!"}
          onClick={() => setActiveTab("history")}
        >
          History
        </Button>
      </div>

      {activeTab === "quizzes" ? (
        <SelectQuizz
          quizzList={quizzList}
          onCreate={handleCreateQuizz}
          onDelete={handleDeleteQuizz}
          onEdit={handleEditQuizz}
          onSelect={handleCreate}
        />
      ) : (
        <HistoryPanel
          history={history}
          onDownload={(runId) => socket?.emit("manager:downloadHistory", { runId })}
        />
      )}
    </div>
  )
}

export default ManagerAuthPage
