import type {
  ManagerSettings,
  ManagerSettingsUpdate,
  Quizz,
  QuizzWithId,
  QuizRunHistorySummary,
} from "@mindbuzz/common/types/game"
import background from "@mindbuzz/web/assets/background.webp"
import logo from "@mindbuzz/web/assets/logo.svg"
import Button from "@mindbuzz/web/features/game/components/Button"
import HistoryPanel from "@mindbuzz/web/features/game/components/create/HistoryPanel"
import QuizzEditor from "@mindbuzz/web/features/game/components/create/QuizzEditor"
import { STATUS } from "@mindbuzz/common/types/game/status"
import ManagerPassword from "@mindbuzz/web/features/game/components/create/ManagerPassword"
import SelectQuizz from "@mindbuzz/web/features/game/components/create/SelectQuizz"
import SettingsPanel from "@mindbuzz/web/features/game/components/create/SettingsPanel"
import {
  useEvent,
  useSocket,
} from "@mindbuzz/web/features/game/contexts/socketProvider"
import { useManagerStore } from "@mindbuzz/web/features/game/stores/manager"
import clsx from "clsx"
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

const TABS = [
  { id: "quizzes", label: "Quizzes" },
  { id: "history", label: "History" },
  { id: "settings", label: "Settings" },
] as const

type ManagerTab = (typeof TABS)[number]["id"]
const MANAGER_AUTH_STORAGE_KEY = "manager_auth"

const readManagerAuth = () => {
  try {
    return localStorage.getItem(MANAGER_AUTH_STORAGE_KEY) === "true"
  } catch {
    return false
  }
}

const persistManagerAuth = (value: boolean) => {
  try {
    if (value) {
      localStorage.setItem(MANAGER_AUTH_STORAGE_KEY, "true")
    } else {
      localStorage.removeItem(MANAGER_AUTH_STORAGE_KEY)
    }
  } catch {
    // Ignore storage failures and fall back to in-memory auth state.
  }
}

const ManagerAuthPage = () => {
  const { reset, setGameId, setStatus } = useManagerStore()
  const navigate = useNavigate()
  const { socket } = useSocket()

  const [isAuth, setIsAuth] = useState(readManagerAuth)
  const [activeTab, setActiveTab] = useState<ManagerTab>("quizzes")
  const [quizzList, setQuizzList] = useState<QuizzWithId[]>([])
  const [history, setHistory] = useState<QuizRunHistorySummary[]>([])
  const [settings, setSettings] = useState<ManagerSettings>({})
  const [editingQuizzId, setEditingQuizzId] = useState<string | null>(null)
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null)

  useEvent("manager:quizzList", (quizzList) => {
    persistManagerAuth(true)
    setIsAuth(true)
    setQuizzList(quizzList)
  })

  useEvent("manager:historyList", (history) => {
    setHistory(history)
  })

  useEvent("manager:settings", (settings) => {
    setSettings(settings)
  })

  useEvent("manager:errorMessage", (message) => {
    if (message === "Manager authentication required") {
      persistManagerAuth(false)
      setIsAuth(false)
      setActiveTab("quizzes")
      setQuizzList([])
      setHistory([])
      setSettings({})
      reset()
      setEditingQuizzId(null)
      setUploadedAudioUrl(null)
    }

    toast.error(message)
  })

  useEvent("manager:quizzCreated", (quizz) => {
    setQuizzList((current) => {
      const filtered = current.filter((item) => item.id !== quizz.id)

      return [...filtered, quizz]
    })
    setEditingQuizzId(quizz.id)
    setActiveTab("quizzes")
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

  useEvent("manager:mediaUploaded", ({ url }) => {
    setUploadedAudioUrl(url)
    toast.success("Audio uploaded")
  })

  useEvent("manager:historyExportReady", ({ filename, content }) => {
    downloadCsv(filename, content)
  })

  useEvent("manager:gameCreated", ({ gameId, inviteCode }) => {
    setGameId(gameId)
    setStatus(STATUS.SHOW_ROOM, { text: "Waiting for the players", inviteCode })
    navigate(`/party/manager/${gameId}`)
  })

  useEvent("connect", () => {
    if (isAuth) {
      socket?.emit("manager:getDashboard")
    }
  })

  useEffect(() => {
    if (isAuth) {
      socket?.emit("manager:getDashboard")
    }
  }, [isAuth, socket])

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

  const handleSelectTab = (tab: ManagerTab) => {
    setActiveTab(tab)
    setEditingQuizzId(null)
  }

  const handleSaveSettings = (settings: ManagerSettingsUpdate) => {
    socket?.emit("manager:updateSettings", settings)
  }

  const handleUploadLocalAudio = (data: { filename: string; content: string }) => {
    socket?.emit("manager:uploadMedia", data)
  }

  const handleDownloadHistory = (runId: string) => {
    socket?.emit("manager:downloadHistory", { runId })
  }

  const handleLogout = () => {
    persistManagerAuth(false)
    setIsAuth(false)
    setActiveTab("quizzes")
    setQuizzList([])
    setHistory([])
    setSettings({})
    setEditingQuizzId(null)
    setUploadedAudioUrl(null)
    reset()
    socket?.emit("manager:logout")
    navigate("/manager")
  }

  const editingQuizz = quizzList.find((quizz) => quizz.id === editingQuizzId)

  let content = null

  if (!isAuth) {
    content = (
      <div className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-4 py-6">
        <img src={logo} className="mb-10 h-16" alt="logo" />
        <ManagerPassword onSubmit={handleAuth} />
      </div>
    )
  } else if (editingQuizz) {
    content = (
      <div className="relative z-10 flex min-h-dvh flex-col items-center px-4 py-6">
        <QuizzEditor
          quizz={editingQuizz}
          onBack={() => setEditingQuizzId(null)}
          onSave={handleUpdateQuizz}
        />
      </div>
    )
  } else {
    const dashboardContent =
      activeTab === "history" ? (
        <HistoryPanel history={history} onDownload={handleDownloadHistory} />
      ) : activeTab === "settings" ? (
        <SettingsPanel
          settings={settings}
          uploadedAudioUrl={uploadedAudioUrl}
          onSave={handleSaveSettings}
          onUploadLocalAudio={handleUploadLocalAudio}
        />
      ) : (
        <SelectQuizz
          quizzList={quizzList}
          onCreate={handleCreateQuizz}
          onDelete={handleDeleteQuizz}
          onEdit={handleEditQuizz}
          onSelect={handleCreate}
        />
      )

    content = (
      <div className="relative z-10 flex min-h-dvh flex-col items-center px-4 py-6">
        <div className="mb-4 flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                type="button"
                className={clsx(
                  "px-4",
                  activeTab === tab.id
                    ? "bg-primary"
                    : "bg-white !text-black",
                )}
                onClick={() => handleSelectTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <Button
            type="button"
            className="self-start bg-white px-4 !text-black sm:self-auto"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {dashboardContent}
      </div>
    )
  }

  return (
    <section className="relative min-h-dvh">
      <div className="fixed top-0 left-0 h-full w-full">
        <img
          className="pointer-events-none h-full w-full object-cover"
          src={background}
          alt="background"
        />
      </div>

      {content}
    </section>
  )
}

export default ManagerAuthPage

