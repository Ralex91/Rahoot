import { Server } from "socket.io"
import { GAME_STATE_INIT, WEBSOCKET_SERVER_PORT } from "../config.mjs"
import Manager from "./roles/manager.js"
import Player from "./roles/player.js"
import { abortCooldown } from "./utils/cooldown.js"
import deepClone from "./utils/deepClone.js"

let gameState = deepClone(GAME_STATE_INIT)

const io = new Server({
  cors: {
    origin: "*",
  },
})

console.log(`Server running on port ${WEBSOCKET_SERVER_PORT}`)
io.listen(WEBSOCKET_SERVER_PORT)

io.on("connection", (socket) => {
  console.log(`A user connected ${socket.id}`)

  socket.on("player:checkRoom", (roomId) =>
    Player.checkRoom(gameState, io, socket, roomId),
  )

  socket.on("player:join", (player) =>
    Player.join(gameState, io, socket, player),
  )

  socket.on("manager:createRoom", (password) =>
    Manager.createRoom(gameState, io, socket, password),
  )
  socket.on("manager:kickPlayer", (playerId) =>
    Manager.kickPlayer(gameState, io, socket, playerId),
  )

  socket.on("manager:startGame", () => Manager.startGame(gameState, io, socket))

  socket.on("player:selectedAnswer", (answerKey) =>
    Player.selectedAnswer(gameState, io, socket, answerKey),
  )

  socket.on("manager:abortQuiz", () => Manager.abortQuiz(gameState, io, socket))

  socket.on("manager:nextQuestion", () =>
    Manager.nextQuestion(gameState, io, socket),
  )

  socket.on("manager:showLeaderboard", () =>
    Manager.showLoaderboard(gameState, io, socket),
  )

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`)
    if (gameState.manager === socket.id) {
      console.log("Reset game")
      io.to(gameState.room).emit("game:reset")
      gameState.started = false
      gameState = deepClone(GAME_STATE_INIT)

      abortCooldown()

      return
    }

    const player = gameState.players.find((p) => p.id === socket.id)

    if (player) {
      gameState.players = gameState.players.filter((p) => p.id !== socket.id)
      socket.to(gameState.manager).emit("manager:removePlayer", player.id)
    }
  })
})
