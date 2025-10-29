import { Player } from "."

export const STATUS = {
  SHOW_ROOM: "SHOW_ROOM",
  SHOW_START: "SHOW_START",
  SHOW_PREPARED: "SHOW_PREPARED",
  SHOW_QUESTION: "SHOW_QUESTION",
  SELECT_ANSWER: "SELECT_ANSWER",
  SHOW_RESULT: "SHOW_RESULT",
  SHOW_RESPONSES: "SHOW_RESPONSES",
  SHOW_LEADERBOARD: "SHOW_LEADERBOARD",
  FINISHED: "FINISHED",
  WAIT: "WAIT",
} as const

export type Status = (typeof STATUS)[keyof typeof STATUS]

export type CommonStatusDataMap = {
  SHOW_START: { time: number; subject: string }
  SHOW_PREPARED: { totalAnswers: number; questionNumber: number }
  SHOW_QUESTION: { question: string; image?: string; cooldown: number }
  SELECT_ANSWER: {
    question: string
    answers: string[]
    image?: string
    time: number
    totalPlayer: number
  }
  SHOW_RESULT: {
    correct: boolean
    message: string
    points: number
    myPoints: number
    rank: number
    aheadOfMe: string | null
  }
  WAIT: { text: string }
  FINISHED: { subject: string; top: Player[] }
}

type ManagerExtraStatus = {
  SHOW_ROOM: { text: string; inviteCode?: string }
  SHOW_RESPONSES: {
    question: string
    responses: Record<number, number>
    correct: number
    answers: string[]
    image?: string
  }
  SHOW_LEADERBOARD: { oldLeaderboard: Player[]; leaderboard: Player[] }
}

export type PlayerStatusDataMap = CommonStatusDataMap
export type ManagerStatusDataMap = CommonStatusDataMap & ManagerExtraStatus
export type StatusDataMap = PlayerStatusDataMap & ManagerStatusDataMap
