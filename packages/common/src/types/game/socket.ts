import { Server as ServerIO, Socket as SocketIO } from "socket.io"
import { GameUpdateQuestion, Player, QuizzWithId } from "."
import { Status, StatusDataMap } from "./status"

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
  "game:status": (data: { name: Status; data: StatusDataMap[Status] }) => void
  "game:successRoom": (data: string) => void
  "game:successJoin": (gameId: string) => void
  "game:totalPlayers": (count: number) => void
  "game:errorMessage": (message: string) => void
  "game:startCooldown": () => void
  "game:cooldown": (count: number) => void
  "game:kick": () => void
  "game:reset": () => void
  "game:updateQuestion": (data: { current: number; total: number }) => void
  "game:playerAnswer": (count: number) => void

  // Player events
  "player:successReconnect": (data: {
    gameId: string
    status: { name: Status; data: StatusDataMap[Status] }
    player: { username: string; points: number }
    currentQuestion: GameUpdateQuestion
  }) => void
  "player:updateLeaderboard": (data: { leaderboard: Player[] }) => void

  // Manager events
  "manager:successReconnect": (data: {
    gameId: string
    status: { name: Status; data: StatusDataMap[Status] }
    players: Player[]
    currentQuestion: GameUpdateQuestion
  }) => void
  "manager:quizzList": (quizzList: QuizzWithId[]) => void
  "manager:gameCreated": (data: { gameId: string; inviteCode: string }) => void
  "manager:statusUpdate": (data: {
    status: Status
    data: StatusDataMap[Status]
  }) => void
  "manager:newPlayer": (player: Player) => void
  "manager:removePlayer": (playerId: string) => void
  "manager:errorMessage": (message: string) => void
  "manager:playerKicked": (playerId: string) => void
}

export interface ClientToServerEvents {
  // Manager actions
  "game:create": (quizzId: string) => void
  "manager:auth": (password: string) => void
  "manager:reconnect": (message: { gameId: string }) => void
  "manager:kickPlayer": (
    message: MessageWithoutStatus<{ playerId: string }>
  ) => void
  "manager:startGame": (message: MessageGameId) => void
  "manager:abortQuiz": (message: MessageGameId) => void
  "manager:nextQuestion": (message: MessageGameId) => void
  "manager:showLeaderboard": (message: MessageGameId) => void

  // Player actions
  "player:join": (inviteCode: string) => void
  "player:login": (message: MessageWithoutStatus<{ username: string }>) => void
  "player:reconnect": (message: { gameId: string }) => void
  "player:selectedAnswer": (
    message: MessageWithoutStatus<{ answerKey: number }>
  ) => void

  // Common
  disconnect: () => void
}
