import type { MEDIA_TYPES } from "@rahoot/common/constants"

export type Player = {
  id: string
  clientId: string
  connected: boolean
  username: string
  points: number
  streak: number
}

export type Answer = {
  playerId: string
  answerId: number
  points: number
}

export type QuestionMediaType =
  | (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES]
  | undefined

export type QuestionMedia = {
  type?: QuestionMediaType
  url: string
}

export type Question = {
  question: string
  media?: QuestionMedia
  answers: string[]
  solutions: number[]
  cooldown: number
  time: number
}

export type Quizz = {
  subject: string
  questions: Question[]
}

export type QuizzWithId = Quizz & { id: string }

export type QuizzMeta = { id: string; subject: string }

export type GameUpdateQuestion = {
  current: number
  total: number
}

export type PlayerAnswerRecord = {
  playerName: string
  answerId: number | null
}

export type QuestionResult = {
  question: string
  answers: string[]
  solutions: number[]
  media?: QuestionMedia
  time: number
  playerAnswers: PlayerAnswerRecord[]
}

export type GameResultPlayer = {
  username: string
  points: number
  rank: number
}

export type GameResult = {
  id: string
  subject: string
  date: string
  players: GameResultPlayer[]
  questions: QuestionResult[]
}

export type GameResultMeta = {
  id: string
  subject: string
  date: string
  playerCount: number
}
