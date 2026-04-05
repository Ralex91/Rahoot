import { EVENTS } from "@rahoot/common/constants"
import { Answer, Player, Quizz } from "@rahoot/common/types/game"
import { Server, Socket } from "@rahoot/common/types/game/socket"
import { Status, STATUS, StatusDataMap } from "@rahoot/common/types/game/status"
import { timeToPoint } from "@rahoot/socket/utils/game"
import sleep from "@rahoot/socket/utils/sleep"
import { CooldownTimer } from "./cooldown-timer"
import { PlayerManager } from "./player-manager"

type BroadcastFn = <T extends Status>(
  _status: T,
  _data: StatusDataMap[T],
) => void
type SendFn = <T extends Status>(
  _target: string,
  _status: T,
  _data: StatusDataMap[T],
) => void

export interface RoundManagerOptions {
  quizz: Quizz
  players: PlayerManager
  cooldown: CooldownTimer
  io: Server
  gameId: string
  getManagerId: () => string
  broadcast: BroadcastFn
  send: SendFn
  onNewQuestion: () => void
}

export class RoundManager {
  private readonly opts: RoundManagerOptions
  private started = false
  private currentQuestion = 0
  private playersAnswers: Answer[] = []
  private startTime = 0
  private leaderboard: Player[] = []
  private tempOldLeaderboard: Player[] | null = null

  constructor(opts: RoundManagerOptions) {
    this.opts = opts
  }

  isStarted(): boolean {
    return this.started
  }

  getReconnectInfo() {
    return {
      current: this.currentQuestion + 1,
      total: this.opts.quizz.questions.length,
    }
  }

  async start(socket: Socket): Promise<void> {
    if (this.opts.getManagerId() !== socket.id) {
      return
    }

    if (this.started) {
      return
    }

    if (this.opts.players.count() === 0) {
      socket.emit(EVENTS.GAME.ERROR_MESSAGE, "No players connected")

      return
    }

    this.started = true

    this.opts.broadcast(STATUS.SHOW_START, {
      time: 3,
      subject: this.opts.quizz.subject,
    })

    await sleep(3)

    this.opts.io.to(this.opts.gameId).emit(EVENTS.GAME.START_COOLDOWN)
    await this.opts.cooldown.start(3)

    void this.newQuestion()
  }

  async newQuestion(): Promise<void> {
    if (!this.started) {
      return
    }

    const question = this.opts.quizz.questions[this.currentQuestion]

    this.opts.onNewQuestion()

    this.opts.io.to(this.opts.gameId).emit(EVENTS.GAME.UPDATE_QUESTION, {
      current: this.currentQuestion + 1,
      total: this.opts.quizz.questions.length,
    })

    this.opts.broadcast(STATUS.SHOW_PREPARED, {
      totalAnswers: question.answers.length,
      questionNumber: this.currentQuestion + 1,
    })

    await sleep(2)

    if (!this.started) {
      return
    }

    this.opts.broadcast(STATUS.SHOW_QUESTION, {
      question: question.question,
      image: question.image,
      cooldown: question.cooldown,
    })

    await sleep(question.cooldown)

    if (!this.started) {
      return
    }

    this.startTime = Date.now()

    this.opts.broadcast(STATUS.SELECT_ANSWER, {
      question: question.question,
      answers: question.answers,
      image: question.image,
      video: question.video,
      audio: question.audio,
      time: question.time,
      totalPlayer: this.opts.players.count(),
    })

    await this.opts.cooldown.start(question.time)

    if (!this.started) {
      return
    }

    this.showResults(question)
  }

  private showResults(question: any): void {
    const currentPlayers = this.opts.players.getAll()

    const oldLeaderboard = (() => {
      if (this.leaderboard.length === 0) {
        return currentPlayers.map((p) => ({ ...p }))
      }

      return this.leaderboard.map((p) => ({ ...p }))
    })()

    const totalType = this.playersAnswers.reduce(
      (acc: Record<number, number>, { answerId }) => {
        acc[answerId] = (acc[answerId] || 0) + 1

        return acc
      },
      {},
    )

    const sortedPlayers = currentPlayers
      .map((player) => {
        const playerAnswer = this.playersAnswers.find(
          (a) => a.playerId === player.id,
        )

        const isCorrect = playerAnswer
          ? playerAnswer.answerId === question.solution
          : false

        const points =
          playerAnswer && isCorrect ? Math.round(playerAnswer.points) : 0

        player.points += points

        return { ...player, lastCorrect: isCorrect, lastPoints: points }
      })
      .sort((a, b) => b.points - a.points)

    this.opts.players.replace(sortedPlayers)

    sortedPlayers.forEach((player, index) => {
      const rank = index + 1
      const aheadPlayer = sortedPlayers[index - 1]

      this.opts.send(player.id, STATUS.SHOW_RESULT, {
        correct: player.lastCorrect,
        message: player.lastCorrect ? "Nice!" : "Too bad",
        points: player.lastPoints,
        myPoints: player.points,
        rank,
        aheadOfMe: aheadPlayer ? aheadPlayer.username : null,
      })
    })

    this.opts.send(this.opts.getManagerId(), STATUS.SHOW_RESPONSES, {
      question: question.question,
      responses: totalType,
      correct: question.solution,
      answers: question.answers,
      image: question.image,
    })

    this.leaderboard = sortedPlayers
    this.tempOldLeaderboard = oldLeaderboard
    this.playersAnswers = []
  }

  selectAnswer(socket: Socket, answerId: number): void {
    const player = this.opts.players.findById(socket.id)
    const question = this.opts.quizz.questions[this.currentQuestion]

    if (!player) {
      return
    }

    if (this.playersAnswers.find((a) => a.playerId === socket.id)) {
      return
    }

    this.playersAnswers.push({
      playerId: player.id,
      answerId,
      points: timeToPoint(this.startTime, question.time),
    })

    this.opts.send(socket.id, STATUS.WAIT, {
      text: "Waiting for the players to answer",
    })

    socket
      .to(this.opts.gameId)
      .emit(EVENTS.GAME.PLAYER_ANSWER, this.playersAnswers.length)
    this.opts.players.broadcastCount()

    if (this.playersAnswers.length === this.opts.players.count()) {
      this.opts.cooldown.abort()
    }
  }

  nextQuestion(socket: Socket): void {
    if (!this.started) {
      return
    }

    if (socket.id !== this.opts.getManagerId()) {
      return
    }

    if (!this.opts.quizz.questions[this.currentQuestion + 1]) {
      return
    }

    this.currentQuestion += 1
    void this.newQuestion()
  }

  abortQuestion(socket: Socket): void {
    if (!this.started) {
      return
    }

    if (socket.id !== this.opts.getManagerId()) {
      return
    }

    this.opts.cooldown.abort()
  }

  showLeaderboard(): void {
    const isLastRound =
      this.currentQuestion + 1 === this.opts.quizz.questions.length

    if (isLastRound) {
      this.started = false

      this.opts.broadcast(STATUS.FINISHED, {
        subject: this.opts.quizz.subject,
        top: this.leaderboard.slice(0, 3),
      })

      return
    }

    const oldLeaderboard = this.tempOldLeaderboard ?? this.leaderboard

    this.opts.send(this.opts.getManagerId(), STATUS.SHOW_LEADERBOARD, {
      oldLeaderboard: oldLeaderboard.slice(0, 5),
      leaderboard: this.leaderboard.slice(0, 5),
    })

    this.tempOldLeaderboard = null
  }
}
