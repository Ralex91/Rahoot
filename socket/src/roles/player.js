import convertTimeToPoint from "../utils/convertTimeToPoint.js"
import { abortCooldown } from "../utils/cooldown.js"

const Player = {
  checkRoom: (game, io, socket, roomId) => {
    if (!game.room || roomId !== game.room) {
      io.to(socket.id).emit("game:errorMessage", "Room not found")
      console.log("zaza")
      return
    }

    io.to(socket.id).emit("game:successRoom", roomId)
  },

  join: (game, io, socket, player) => {
    if (!player.room || !player.room || game.started) {
      return
    }

    console.log("joined", player)

    socket.join(player.room)

    let playerData = {
      username: player.username,
      room: player.room,
      id: socket.id,
      points: 0,
    }
    socket.to(player.room).emit("manager:newPlayer", { ...playerData })

    game.players.push(playerData)

    io.to(socket.id).emit("game:successJoin")
  },

  selectedAnswer: (game, io, socket, answerKey) => {
    const player = game.players.find((player) => player.id === socket.id)
    const question = game.questions[game.currentQuestion]

    if (!player) {
      return
    }

    if (game.playersAnswer.find((p) => p.id === socket.id)) {
      return
    }

    game.playersAnswer.push({
      id: socket.id,
      answer: answerKey,
      points: convertTimeToPoint(game.roundStartTime, question.time),
    })

    io.to(socket.id).emit("game:status", {
      name: "WAIT",
      data: { text: "Waiting for the players to answer" },
    })
    socket.to(game.room).emit("game:playerAnswer", game.playersAnswer.length)

    if (game.playersAnswer.length === game.players.length) {
      abortCooldown()
    }
  },
}

export default Player
