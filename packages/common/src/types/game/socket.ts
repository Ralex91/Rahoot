import type {
  GameUpdateQuestion,
  Player,
  QuizzWithId,
} from "@rahoot/common/types/game"
import type { Status, StatusDataMap } from "@rahoot/common/types/game/status"
import { Server as ServerIO, Socket as SocketIO } from "socket.io"

export type Server = ServerIO<ClientToServerEvents, ServerToClientEvents>
export type Socket = SocketIO<ClientToServerEvents, ServerToClientEvents>

export type Message<K extends keyof StatusDataMap = keyof StatusDataMap> = {
  gameId?: string
  status: K
  data: StatusDataMap[K]
}

export type MessageWithoutStatus<T = any> = {
  gameId?: string
  data: T
}

export type MessageGameId = {
  gameId?: string
}

export interface ServerToClientEvents {
  connect: () => void

  // Game events
  "game:status": (_data: { name: Status; data: StatusDataMap[Status] }) => void
  "game:successRoom": (_data: string) => void
  "game:successJoin": (_gameId: string) => void
  "game:totalPlayers": (_count: number) => void
  "game:errorMessage": (_message: string) => void
  "game:startCooldown": () => void
  "game:cooldown": (_count: number) => void
  "game:reset": (_message: string) => void
  "game:updateQuestion": (_data: { current: number; total: number }) => void
  "game:playerAnswer": (_count: number) => void

  // Player events
  "player:successReconnect": (_data: {
    gameId: string
    status: { name: Status; data: StatusDataMap[Status] }
    player: { username: string; points: number }
    currentQuestion: GameUpdateQuestion
  }) => void
  "player:updateLeaderboard": (_data: { leaderboard: Player[] }) => void
  "player:avatarData": (
    _data: { token: string; avatar: string } | null,
  ) => void
  "player:avatarSaved": (_data: {
    success: boolean
    token?: string
    error?: string
  }) => void

  // Manager events
  "manager:successReconnect": (_data: {
    gameId: string
    status: { name: Status; data: StatusDataMap[Status] }
    players: Player[]
    currentQuestion: GameUpdateQuestion
  }) => void
  "manager:quizzList": (_quizzList: QuizzWithId[]) => void
  "manager:gameCreated": (_data: {
    gameId: string
    inviteCode: string
  }) => void
  "manager:statusUpdate": (_data: {
    status: Status
    data: StatusDataMap[Status]
  }) => void
  "manager:newPlayer": (_player: Player) => void
  "manager:removePlayer": (_playerId: string) => void
  "manager:errorMessage": (_message: string) => void
  "manager:playerKicked": (_playerId: string) => void
  "manager:quizCreated": (_data: {
    success: boolean
    id?: string
    error?: string
  }) => void
  "manager:quizImportResult": (_data: {
    success: boolean
    id?: string
    error?: string
  }) => void
  "manager:quizExists": (_data: {
    exists: boolean
    id: string
    subject: string
    questions: any[]
  }) => void
  "manager:quizDeleted": (_data: {
    success: boolean
    error?: string
  }) => void
}

export interface ClientToServerEvents {
  // Manager actions
  "game:create": (_quizzId: string) => void
  "manager:auth": (_password: string) => void
  "manager:reconnect": (_message: { gameId: string }) => void
  "manager:kickPlayer": (
    _message: { gameId: string; playerId: string },
  ) => void
  "manager:startGame": (_message: MessageGameId) => void
  "manager:abortQuiz": (_message: MessageGameId) => void
  "manager:nextQuestion": (_message: MessageGameId) => void
  "manager:showLeaderboard": (_message: MessageGameId) => void
  "manager:createQuiz": (_data: {
    subject: string
    questions: any[]
  }) => void
  "manager:confirmCreateQuiz": (_data: {
    subject: string
    questions: any[]
    id?: string
  }) => void
  "manager:importQuiz": (_data: {
    subject: string
    questions: any[]
  }) => void
  "manager:deleteQuiz": (_quizzId: string) => void

  // Player actions
  "player:join": (_inviteCode: string) => void
  "player:login": (_message: MessageWithoutStatus<{
    username: string
    avatar?: string
    token?: string | null
  }>) => void
  "player:reconnect": (_message: { gameId: string }) => void
  "player:selectedAnswer": (
    _message: MessageWithoutStatus<{ answerKey: number }>,
  ) => void
  "player:getAvatar": (_username: string) => void
  "player:saveAvatar": (_data: {
    username: string
    avatar: string
    token?: string | null
  }) => void

  // Common
  disconnect: () => void
}
