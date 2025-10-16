import { Answer, Player, Quizz } from "@rahoot/common/types/game"
import { Server, Socket } from "@rahoot/common/types/game/socket"
import { Status } from "@rahoot/common/types/game/status"
import createInviteCode from "@rahoot/socket/utils/inviteCode"
import { v4 as uuid } from "uuid"
import sleep from "../utils/sleep"

class Game {
  io: Server

  gameId: string
  managerId: string
  inviteCode: string
  started: boolean
  status: Status
  quizz: Quizz
  players: Player[]

  round: {
    currentQuestion: number
    playersAnswers: Answer[]
    startTime: number
  }

  cooldown: {
    active: boolean
    ms: number
  }

  constructor(io: Server, socket: Socket, quizz: Quizz) {
    if (!io) {
      throw new Error("Socket server not initialized")
    }

    this.io = io
    this.gameId = uuid()
    this.managerId = ""
    this.inviteCode = ""
    this.started = false
    this.status = Status.SHOW_START
    this.players = []

    this.round = {
      playersAnswers: [],
      currentQuestion: 0,
      startTime: 0,
    }

    this.cooldown = {
      active: false,
      ms: 0,
    }

    const roomInvite = createInviteCode()
    this.inviteCode = roomInvite
    this.managerId = socket.id
    this.quizz = quizz

    socket.join(this.gameId)
    socket.emit("manager:gameCreated", {
      gameId: this.gameId,
      inviteCode: roomInvite,
    })

    console.log(
      `New game created: ${roomInvite} subject: ${this.quizz.subject}`
    )
  }

  join(socket: Socket, username: string) {
    socket.join(this.gameId)

    const playerData = {
      id: socket.id,
      username: username,
      points: 0,
    }

    this.players.push(playerData)

    this.io.to(this.managerId).emit("manager:newPlayer", playerData)
    this.io.to(this.gameId).emit("game:totalPlayers", this.players.length)

    socket.emit("game:successJoin", this.gameId)
  }

  kickPlayer(socket: Socket, playerId: string) {
    if (this.managerId !== socket.id) {
      return
    }

    const player = this.players.find((p) => p.id === playerId)

    if (!player) {
      return
    }

    this.players = this.players.filter((p) => p.id !== playerId)

    this.io.in(playerId).socketsLeave(this.gameId)
    this.io.to(player.id).emit("game:kick")
    this.io.to(this.managerId).emit("manager:playerKicked", player.id)

    this.io.to(this.gameId).emit("game:totalPlayers", this.players.length)
  }

  async startCooldown(seconds: number) {
    if (this.cooldown.active) {
      return
    }

    this.cooldown.active = true

    let count = seconds - 1

    return new Promise<void>((resolve) => {
      const cooldownTimeout = setInterval(() => {
        if (!this.cooldown.active || count <= 0) {
          this.cooldown.active = false
          clearInterval(cooldownTimeout)
          resolve()
        } else {
          this.io.to(this.gameId).emit("game:cooldown", count)
          count -= 1
        }
      }, 1000)
    })
  }

  async abortCooldown() {
    if (this.cooldown.active) {
      this.cooldown.active = false
    }
  }

  async start(socket: Socket) {
    if (this.managerId !== socket.id) {
      return
    }

    if (this.started) {
      return
    }

    this.started = true
    this.io.to(this.gameId).emit("game:status", {
      name: Status.SHOW_START,
      data: {
        time: 3,
        subject: this.quizz.subject,
      },
    })

    await sleep(3)

    this.io.to(this.gameId).emit("game:startCooldown")

    await this.startCooldown(3)

    this.newRound()
  }

  async newRound() {
    const question = this.quizz.questions[this.round.currentQuestion]

    if (!this.started) {
      return
    }

    this.io.to(this.gameId).emit("game:updateQuestion", {
      current: this.round.currentQuestion + 1,
      total: this.quizz.questions.length,
    })

    this.io.to(this.gameId).emit("game:status", {
      name: Status.SHOW_PREPARED,
      data: {
        totalAnswers: question.answers.length,
        questionNumber: this.round.currentQuestion + 1,
      },
    })

    await sleep(2)

    if (!this.started) {
      return
    }

    this.io.to(this.gameId).emit("game:status", {
      name: Status.SHOW_QUESTION,
      data: {
        question: question.question,
        image: question.image,
        cooldown: question.cooldown,
      },
    })

    await sleep(question.cooldown)

    if (!this.started) {
      return
    }

    this.round.startTime = Date.now()

    this.io.to(this.gameId).emit("game:status", {
      name: Status.SELECT_ANSWER,
      data: {
        question: question.question,
        answers: question.answers,
        image: question.image,
        time: question.time,
        totalPlayer: this.players.length,
      },
    })

    await this.startCooldown(question.time)

    if (!this.started) {
      return
    }

    this.players = this.players.map((player) => {
      const playerAnswer = this.round.playersAnswers.find(
        (a) => a.playerId === player.id
      )

      const isCorrect = playerAnswer
        ? playerAnswer.answerId === question.solution
        : false

      const points =
        playerAnswer && isCorrect
          ? Math.round(playerAnswer && playerAnswer.points)
          : 0

      player.points += points

      const sortPlayers = this.players.sort((a, b) => b.points - a.points)

      const rank = sortPlayers.findIndex((p) => p.id === player.id) + 1
      const aheadPlayer = sortPlayers[rank - 2]

      this.io.to(player.id).emit("game:status", {
        name: Status.SHOW_RESULT,
        data: {
          correct: isCorrect,
          message: isCorrect ? "Nice !" : "Too bad",
          points,
          myPoints: player.points,
          rank,
          aheadOfMe: aheadPlayer ? aheadPlayer.username : null,
        },
      })

      return player
    })

    const totalType = this.round.playersAnswers.reduce(
      (acc: Record<number, number>, { answerId }) => {
        acc[answerId] = (acc[answerId] || 0) + 1
        return acc
      },
      {}
    )

    // Manager
    this.io.to(this.gameId).emit("game:status", {
      name: Status.SHOW_RESPONSES,
      data: {
        question: question.question,
        responses: totalType,
        correct: question.solution,
        answers: question.answers,
        image: question.image,
      },
    })

    this.round.playersAnswers = []
  }

  timeToPoint(startTime: number, secondes: number) {
    let points = 1000

    const actualTime = Date.now()
    const tempsPasseEnSecondes = (actualTime - startTime) / 1000

    points -= (1000 / secondes) * tempsPasseEnSecondes
    points = Math.max(0, points)

    return points
  }

  async selectAnswer(socket: Socket, answerId: number) {
    const player = this.players.find((player) => player.id === socket.id)

    const question = this.quizz.questions[this.round.currentQuestion]

    if (!player) {
      return
    }

    if (this.round.playersAnswers.find((p) => p.playerId === socket.id)) {
      return
    }

    this.round.playersAnswers.push({
      playerId: player.id,
      answerId,
      points: this.timeToPoint(this.round.startTime, question.time),
    })

    socket.emit("game:status", {
      name: Status.WAIT,
      data: { text: "Waiting for the players to answer" },
    })
    socket
      .to(this.gameId)
      .emit("game:playerAnswer", this.round.playersAnswers.length)

    this.io.to(this.gameId).emit("game:totalPlayers", this.players.length)

    if (this.round.playersAnswers.length === this.players.length) {
      this.abortCooldown()
    }
  }

  nextRound(socket: Socket) {
    if (!this.started) {
      return
    }

    if (socket.id !== this.managerId) {
      return
    }

    if (!this.quizz.questions[this.round.currentQuestion + 1]) {
      return
    }

    this.round.currentQuestion += 1
    this.newRound()
  }

  abortRound(socket: Socket) {
    if (!this.started) {
      return
    }

    if (socket.id !== this.managerId) {
      return
    }

    this.abortCooldown()
  }

  showLeaderboard(socket: Socket) {
    const isLastRound =
      this.round.currentQuestion + 1 === this.quizz.questions.length

    const sortedPlayers = this.players.sort((a, b) => b.points - a.points)

    if (isLastRound) {
      socket.emit("game:status", {
        name: Status.FINISHED,
        data: {
          subject: this.quizz.subject,
          top: sortedPlayers.slice(0, 3),
        },
      })

      return
    }

    socket.emit("game:status", {
      name: Status.SHOW_LEADERBOARD,
      data: {
        leaderboard: sortedPlayers.slice(0, 5),
      },
    })
  }
}

export default Game
