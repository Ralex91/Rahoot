import { Server, Socket } from "@rahoot/common/types/game/socket"
import env from "@rahoot/socket/env"
import Config from "@rahoot/socket/services/config"
import Game from "@rahoot/socket/services/game"
import { inviteCodeValidator } from "@rahoot/socket/utils/validator"
import { Server as ServerIO } from "socket.io"

const io: Server = new ServerIO()
Config.init()

let games: Game[] = []
const port = env.SOCKER_PORT || 3001

console.log(`Socket server running on port ${port}`)
io.listen(Number(port))

function withGame<T>(
  gameId: string | undefined,
  socket: Socket,
  games: Game[],
  handler: (game: Game) => T
): T | void {
  let game = null

  if (gameId) {
    game = games.find((g) => g.gameId === gameId)
  } else {
    game = games.find(
      (g) =>
        g.players.find((p) => p.id === socket.id) || g.managerId === socket.id
    )
  }

  if (!game) {
    socket.emit("game:errorMessage", "Game not found")
    return
  }

  return handler(game)
}

io.on("connection", (socket) => {
  console.log(`A user connected ${socket.id}`)
  console.log(socket.handshake.auth)

  socket.on("manager:auth", (password) => {
    try {
      const config = Config.game()

      if (password !== config.managerPassword) {
        socket.emit("manager:errorMessage", "Invalid password")
        return
      }

      socket.emit("manager:quizzList", Config.quizz())
    } catch (error) {
      console.error("Failed to read game config:", error)
      socket.emit("manager:errorMessage", "Failed to read game config")
    }
  })

  socket.on("game:create", (quizzId) => {
    const quizzList = Config.quizz()
    const quizz = quizzList.find((q) => q.id === quizzId)

    if (!quizz) {
      socket.emit("game:errorMessage", "Quizz not found")
      return
    }

    const game = new Game(io, socket, quizz)

    games.push(game)
  })

  socket.on("player:join", async (inviteCode) => {
    const result = inviteCodeValidator.safeParse(inviteCode)

    if (result.error) {
      socket.emit("game:errorMessage", result.error.issues[0].message)
      return
    }

    const game = games.find((g) => g.inviteCode === inviteCode)

    if (!game) {
      socket.emit("game:errorMessage", "Game not found")

      return
    }

    socket.emit("game:successRoom", game.gameId)
  })

  socket.on("player:login", ({ gameId, data }) =>
    withGame(gameId, socket, games, (game) => game.join(socket, data.username))
  )

  socket.on("manager:kickPlayer", ({ gameId, data }) =>
    withGame(gameId, socket, games, (game) =>
      game.kickPlayer(socket, data.playerId)
    )
  )

  socket.on("manager:startGame", ({ gameId }) =>
    withGame(gameId, socket, games, (game) => game.start(socket))
  )

  socket.on("player:selectedAnswer", ({ gameId, data }) =>
    withGame(gameId, socket, games, (game) =>
      game.selectAnswer(socket, data.answerKey)
    )
  )

  socket.on("manager:abortQuiz", ({ gameId }) =>
    withGame(gameId, socket, games, (game) => game.abortRound(socket))
  )

  socket.on("manager:nextQuestion", ({ gameId }) =>
    withGame(gameId, socket, games, (game) => game.nextRound(socket))
  )

  socket.on("manager:showLeaderboard", ({ gameId }) =>
    withGame(gameId, socket, games, (game) => game.showLeaderboard(socket))
  )

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`)
    const managerGame = games.find((g) => g.managerId === socket.id)

    if (managerGame) {
      console.log("Reset game (manager disconnected)")

      managerGame.abortCooldown()
      io.to(managerGame.gameId).emit("game:reset")

      games = games.filter((g) => g.gameId !== managerGame.gameId)

      return
    }

    const game = games.find((g) => g.players.some((p) => p.id === socket.id))

    if (game) {
      const player = game.players.find((p) => p.id === socket.id)

      if (player) {
        game.players = game.players.filter((p) => p.id !== socket.id)

        io.to(game.managerId).emit("manager:removePlayer", player.id)
        io.to(game.gameId).emit("game:totalPlayers", game.players.length)

        console.log(
          `Removed player ${player.username} from game ${game.gameId}`
        )
      }
    }
  })
})
