import { EVENTS } from "@rahoot/common/constants"
import { Server } from "@rahoot/common/types/game/socket"
import { inviteCodeValidator } from "@rahoot/common/validators/auth"
import Config from "@rahoot/socket/services/config"
import Game from "@rahoot/socket/services/game"
import Registry from "@rahoot/socket/services/registry"
import { withGame } from "@rahoot/socket/utils/game"
import { Server as ServerIO } from "socket.io"

const WS_PORT = 3001

const io: Server = new ServerIO({
  path: "/ws",
})
Config.init()

const registry = Registry.getInstance()

console.log(`Socket server running on port ${WS_PORT}`)
io.listen(WS_PORT)

io.on("connection", (socket) => {
  console.log(
    `A user connected: socketId: ${socket.id}, clientId: ${socket.handshake.auth.clientId}`,
  )

  socket.on(EVENTS.PLAYER.RECONNECT, ({ gameId }) => {
    const game = registry.getPlayerGame(gameId, socket.handshake.auth.clientId)

    if (game) {
      game.reconnect(socket)

      return
    }

    socket.emit(EVENTS.GAME.RESET, "Game not found")
  })

  socket.on(EVENTS.MANAGER.RECONNECT, ({ gameId }) => {
    const game = registry.getManagerGame(gameId, socket.handshake.auth.clientId)

    if (game) {
      game.reconnect(socket)

      return
    }

    socket.emit(EVENTS.GAME.RESET, "Game expired")
  })

  socket.on(EVENTS.MANAGER.AUTH, (password) => {
    try {
      const config = Config.game()

      if (config.managerPassword === "PASSWORD") {
        socket.emit(
          EVENTS.MANAGER.ERROR_MESSAGE,
          "Manager password is not configured",
        )

        return
      }

      if (password !== config.managerPassword) {
        socket.emit(EVENTS.MANAGER.ERROR_MESSAGE, "Invalid password")

        return
      }

      socket.emit(EVENTS.MANAGER.QUIZZ_LIST, Config.quizz())
    } catch (error) {
      console.error("Failed to read game config:", error)
      socket.emit(EVENTS.MANAGER.ERROR_MESSAGE, "Failed to read game config")
    }
  })

  socket.on(EVENTS.GAME.CREATE, (quizzId) => {
    const quizzList = Config.quizz()
    const quizz = quizzList.find((q) => q.id === quizzId)

    if (!quizz) {
      socket.emit(EVENTS.GAME.ERROR_MESSAGE, "Quizz not found")

      return
    }

    const game = new Game(io, socket, quizz)
    registry.addGame(game)
  })

  socket.on(EVENTS.PLAYER.JOIN, (inviteCode) => {
    const result = inviteCodeValidator.safeParse(inviteCode)

    if (result.error) {
      socket.emit(EVENTS.GAME.ERROR_MESSAGE, result.error.issues[0].message)

      return
    }

    const game = registry.getGameByInviteCode(inviteCode)

    if (!game) {
      socket.emit(EVENTS.GAME.ERROR_MESSAGE, "Game not found")

      return
    }

    socket.emit(EVENTS.GAME.SUCCESS_ROOM, game.gameId)
  })

  socket.on(EVENTS.PLAYER.LOGIN, ({ gameId, data }) =>
    withGame(gameId, socket, (game) => game.join(socket, data.username)),
  )

  socket.on(EVENTS.MANAGER.KICK_PLAYER, ({ gameId, playerId }) =>
    withGame(gameId, socket, (game) => game.kickPlayer(socket, playerId)),
  )

  socket.on(EVENTS.MANAGER.START_GAME, ({ gameId }) =>
    withGame(gameId, socket, (game) => game.start(socket)),
  )

  socket.on(EVENTS.PLAYER.SELECTED_ANSWER, ({ gameId, data }) =>
    withGame(gameId, socket, (game) =>
      game.selectAnswer(socket, data.answerKey),
    ),
  )

  socket.on(EVENTS.MANAGER.ABORT_QUIZ, ({ gameId }) =>
    withGame(gameId, socket, (game) => game.abortRound(socket)),
  )

  socket.on(EVENTS.MANAGER.NEXT_QUESTION, ({ gameId }) =>
    withGame(gameId, socket, (game) => game.nextRound(socket)),
  )

  socket.on(EVENTS.MANAGER.SHOW_LEADERBOARD, ({ gameId }) =>
    withGame(gameId, socket, (game) => game.showLeaderboard()),
  )

  socket.on("disconnect", () => {
    console.log(`A user disconnected : ${socket.id}`)

    const managerGame = registry.getGameByManagerSocketId(socket.id)

    if (managerGame) {
      managerGame.setManagerDisconnected()
      registry.markGameAsEmpty(managerGame)

      if (!managerGame.started) {
        console.log("Reset game (manager disconnected)")
        managerGame.abortCooldown()
        io.to(managerGame.gameId).emit(
          EVENTS.GAME.RESET,
          "Manager disconnected",
        )
        registry.removeGame(managerGame.gameId)

        return
      }
    }

    const game = registry.getGameByPlayerSocketId(socket.id)

    if (!game) {
      return
    }

    if (!game.started) {
      const player = game.removePlayer(socket.id)

      if (player) {
        console.log(
          `Removed player ${player.username} from game ${game.gameId}`,
        )
      }

      return
    }

    game.setPlayerDisconnected(socket.id)
  })
})

process.on("SIGINT", () => {
  Registry.getInstance().cleanup()
  process.exit(0)
})

process.on("SIGTERM", () => {
  Registry.getInstance().cleanup()
  process.exit(0)
})
