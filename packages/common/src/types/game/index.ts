import type { MEDIA_TYPES } from "@rahoot/common/constants"

export type Player = {
  id: string
  clientId: string
  connected: boolean
  username: string
  points: number
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
