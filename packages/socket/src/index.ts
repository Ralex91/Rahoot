import { Server, Socket } from "@rahoot/common/types/game/socket"
import { inviteCodeValidator } from "@rahoot/common/validators/auth"
import Config from "@rahoot/socket/services/config"
import Game from "@rahoot/socket/services/game"
import History from "@rahoot/socket/services/history"
import Registry from "@rahoot/socket/services/registry"
import { withGame } from "@rahoot/socket/utils/game"
import fs from "fs"
import { createServer } from "http"
import { extname, relative, resolve } from "path"
import { Server as ServerIO } from "socket.io"

const WS_PORT = 3001

const mimeTypes: Record<string, string> = {
  ".aac": "audio/aac",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".webm": "audio/webm",
}

const getMimeType = (filename: string) =>
  mimeTypes[extname(filename).toLowerCase()] ?? "application/octet-stream"

const httpServer = createServer((req, res) => {
  if (!req.url) {
    res.statusCode = 404
    res.end("Not found")

    return
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host ?? "localhost"}`)

  if (requestUrl.pathname.startsWith("/ws")) {
    return
  }

  if (req.method !== "GET" || !requestUrl.pathname.startsWith("/media/")) {
    res.statusCode = 404
    res.end("Not found")

    return
  }

  const mediaDirectory = Config.mediaDirectory()
  const relativePath = decodeURIComponent(
    requestUrl.pathname.slice("/media/".length),
  )
  const filePath = resolve(mediaDirectory, relativePath)
  const pathFromMediaRoot = relative(mediaDirectory, filePath)

  if (
    !relativePath ||
    pathFromMediaRoot.startsWith("..") ||
    !fs.existsSync(filePath) ||
    !fs.statSync(filePath).isFile()
  ) {
    res.statusCode = 404
    res.end("Not found")

    return
  }

  res.writeHead(200, {
    "Content-Type": getMimeType(filePath),
    "Cache-Control": "public, max-age=3600",
  })
  fs.createReadStream(filePath).pipe(res)
})

const io: Server = new ServerIO(httpServer, {
  path: "/ws",
  maxHttpBufferSize: 25 * 1024 * 1024,
})
Config.init()
History.init()

const registry = Registry.getInstance()
const authenticatedManagers = new Set<string>()

const emitManagerDashboard = (socket: Socket) => {
  socket.emit("manager:quizzList", Config.quizz())
  socket.emit("manager:historyList", History.listRuns())
  socket.emit("manager:settings", Config.managerSettings())
}

const getSocketClientId = (socket: { handshake: { auth: { clientId?: string } } }) =>
  socket.handshake.auth.clientId ?? ""

const ensureAuthenticatedManager = (socket: {
  handshake: { auth: { clientId?: string } }
}) => authenticatedManagers.has(getSocketClientId(socket))

console.log(`Socket server running on port ${WS_PORT}`)
httpServer.listen(WS_PORT)

io.on("connection", (socket) => {
  console.log(
    `A user connected: socketId: ${socket.id}, clientId: ${socket.handshake.auth.clientId}`,
  )

  socket.on("player:reconnect", ({ gameId }) => {
    const game = registry.getPlayerGame(gameId, socket.handshake.auth.clientId)

    if (game) {
      game.reconnect(socket)

      return
    }

    socket.emit("game:reset", "Game not found")
  })

  socket.on("manager:reconnect", ({ gameId }) => {
    const game = registry.getManagerGame(gameId, socket.handshake.auth.clientId)

    if (game) {
      game.reconnect(socket)

      return
    }

    socket.emit("game:reset", "Game expired")
  })

  socket.on("manager:auth", (password) => {
    try {
      const config = Config.game()

      if (config.managerPassword === "PASSWORD") {
        socket.emit("manager:errorMessage", "Manager password is not configured")

        return
      }

      if (password !== config.managerPassword) {
        socket.emit("manager:errorMessage", "Invalid password")

        return
      }

      authenticatedManagers.add(getSocketClientId(socket))
      emitManagerDashboard(socket)
    } catch (error) {
      console.error("Failed to read game config:", error)
      socket.emit("manager:errorMessage", "Failed to read game config")
    }
  })

  socket.on("manager:getDashboard", () => {
    if (!ensureAuthenticatedManager(socket)) {
      socket.emit("manager:errorMessage", "Manager authentication required")

      return
    }

    emitManagerDashboard(socket)
  })

  socket.on("manager:logout", () => {
    authenticatedManagers.delete(getSocketClientId(socket))
  })

  socket.on("game:create", (quizzId) => {
    if (!ensureAuthenticatedManager(socket)) {
      socket.emit("manager:errorMessage", "Manager authentication required")

      return
    }

    const quizzList = Config.quizz()
    const quizz = quizzList.find((q) => q.id === quizzId)

    if (!quizz) {
      socket.emit("game:errorMessage", "Quiz not found")

      return
    }

    const game = new Game(io, socket, quizz)
    registry.addGame(game)
  })

  socket.on("manager:createQuizz", ({ subject }) => {
    if (!ensureAuthenticatedManager(socket)) {
      socket.emit("manager:errorMessage", "Manager authentication required")

      return
    }

    try {
      const quizz = Config.createQuizz(subject)
      socket.emit("manager:quizzCreated", quizz)
      socket.emit("manager:quizzList", Config.quizz())
    } catch (error) {
      console.error("Failed to create quizz:", error)
      socket.emit(
        "manager:errorMessage",
        error instanceof Error ? error.message : "Failed to create quiz",
      )
    }
  })

  socket.on("manager:updateQuizz", ({ quizzId, quizz }) => {
    if (!ensureAuthenticatedManager(socket)) {
      socket.emit("manager:errorMessage", "Manager authentication required")

      return
    }

    try {
      const updatedQuizz = Config.updateQuizz(quizzId, quizz)
      socket.emit("manager:quizzUpdated", updatedQuizz)
      socket.emit("manager:quizzList", Config.quizz())
    } catch (error) {
      console.error("Failed to update quizz:", error)
      socket.emit(
        "manager:errorMessage",
        error instanceof Error ? error.message : "Failed to update quiz",
      )
    }
  })

  socket.on("manager:deleteQuizz", ({ quizzId }) => {
    if (!ensureAuthenticatedManager(socket)) {
      socket.emit("manager:errorMessage", "Manager authentication required")

      return
    }

    try {
      Config.deleteQuizz(quizzId)
      socket.emit("manager:quizzDeleted", quizzId)
      socket.emit("manager:quizzList", Config.quizz())
    } catch (error) {
      console.error("Failed to delete quizz:", error)
      socket.emit(
        "manager:errorMessage",
        error instanceof Error ? error.message : "Failed to delete quiz",
      )
    }
  })

  socket.on("manager:updateSettings", (settings) => {
    if (!ensureAuthenticatedManager(socket)) {
      socket.emit("manager:errorMessage", "Manager authentication required")

      return
    }

    try {
      const nextSettings = Config.updateManagerSettings(settings)
      socket.emit("manager:settings", nextSettings)
    } catch (error) {
      console.error("Failed to update manager settings:", error)
      socket.emit(
        "manager:errorMessage",
        error instanceof Error ? error.message : "Failed to update settings",
      )
    }
  })

  socket.on("manager:uploadMedia", ({ filename, content }) => {
    if (!ensureAuthenticatedManager(socket)) {
      socket.emit("manager:errorMessage", "Manager authentication required")

      return
    }

    try {
      const url = Config.uploadMedia(filename, content)
      socket.emit("manager:mediaUploaded", { url })
    } catch (error) {
      console.error("Failed to upload media:", error)
      socket.emit(
        "manager:errorMessage",
        error instanceof Error ? error.message : "Failed to upload audio file",
      )
    }
  })

  socket.on("manager:downloadHistory", ({ runId }) => {
    if (!ensureAuthenticatedManager(socket)) {
      socket.emit("manager:errorMessage", "Manager authentication required")

      return
    }

    try {
      socket.emit("manager:historyExportReady", History.exportCsv(runId))
    } catch (error) {
      console.error("Failed to export history:", error)
      socket.emit(
        "manager:errorMessage",
        error instanceof Error ? error.message : "Failed to export history",
      )
    }
  })

  socket.on("player:join", (inviteCode) => {
    const result = inviteCodeValidator.safeParse(inviteCode)

    if (result.error) {
      socket.emit("game:errorMessage", result.error.issues[0].message)

      return
    }

    const game = registry.getGameByInviteCode(inviteCode)

    if (!game) {
      socket.emit("game:errorMessage", "Game not found")

      return
    }

    socket.emit("game:successRoom", game.gameId)
  })

  socket.on("player:login", ({ gameId, data }) =>
    withGame(gameId, socket, (game) => game.join(socket, data.username)),
  )

  socket.on("manager:kickPlayer", ({ gameId, playerId }) =>
    withGame(gameId, socket, (game) => game.kickPlayer(socket, playerId)),
  )

  socket.on("manager:startGame", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.start(socket)),
  )

  socket.on("player:selectedAnswer", ({ gameId, data }) =>
    withGame(gameId, socket, (game) =>
      game.selectAnswer(socket, data.answerKey),
    ),
  )

  socket.on("manager:abortQuiz", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.abortRound(socket)),
  )

  socket.on("manager:nextQuestion", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.nextRound(socket)),
  )

  socket.on("manager:showLeaderboard", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.showLeaderboard()),
  )

  socket.on("manager:endGame", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.endGame(socket)),
  )

  socket.on("disconnect", () => {
    console.log(`A user disconnected : ${socket.id}`)

    const managerGame = registry.getGameByManagerSocketId(socket.id)

    if (managerGame) {
      managerGame.manager.connected = false
      registry.markGameAsEmpty(managerGame)

      if (!managerGame.started) {
        console.log("Reset game (manager disconnected)")
        managerGame.abortCooldown()
        io.to(managerGame.gameId).emit("game:reset", "Manager disconnected")
        registry.removeGame(managerGame.gameId)

        return
      }
    }

    const game = registry.getGameByPlayerSocketId(socket.id)

    if (!game) {
      return
    }

    const player = game.players.find((p) => p.id === socket.id)

    if (!player) {
      return
    }

    if (!game.started) {
      player.connected = false
      game.schedulePlayerRemoval(player.id)
      io.to(game.gameId).emit("game:totalPlayers", game.players.length)

      console.log(
        `Marked player ${player.username} as disconnected in game ${game.gameId}`,
      )

      return
    }

    player.connected = false
    io.to(game.gameId).emit("game:totalPlayers", game.players.length)
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
