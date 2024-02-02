import { Server } from "socket.io"
import { GAME_STATE_INIT } from "./quizz.config.js"
import Manager from "./roles/manager.js"
import Player from "./roles/player.js"

let gameState = GAME_STATE_INIT

const io = new Server({
  cors: {
    origin: "*",
  },
  path: "/ws/",
})

io.listen(5157)

io.on("connection", (socket) => {
  console.log(`A user connected ${socket.id}`)

  socket.on("player:checkRoom", (roomId) =>
    Player.checkRoom(gameState, io, socket, roomId),
  )

  socket.on("player:join", (player) =>
    Player.join(gameState, io, socket, player),
  )

  socket.on("manager:createRoom", () =>
    Manager.createRoom(gameState, io, socket),
  )
  socket.on("manager:kickPlayer", (playerId) =>
    Manager.kickPlayer(gameState, io, socket, playerId),
  )

  socket.on("manager:startGame", () => Manager.startGame(gameState, io, socket))

  socket.on("player:selectedAnswer", (answerKey) =>
    Player.selectedAnswer(gameState, io, socket, answerKey),
  )

  socket.on("manager:nextQuestion", () =>
    Manager.nextQuestion(gameState, io, socket),
  )

  socket.on("manager:showLeaderboard", () =>
    Manager.showLoaderboard(gameState, io, socket),
  )

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`)
    /*if (gameState.manager === socket.id) {
      console.log("Reset game")
      gameState = gameStateInit
    }*/
  })
})
