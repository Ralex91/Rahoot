import convertTimeToPoint from "../utils/convertTimeToPoint.js"
import { abortCooldown } from "../utils/cooldown.js"
import { inviteCodeValidator, usernameValidator } from "../validator.js"

import {
  deleteDisconnectedPlayer, //importing the new module for disconnected players
  getDisconnectedPlayer,
} from "../utils/disconnectedStore.js"

const Player = {
  checkRoom: async (game, io, socket, roomId) => {
    try {
      await inviteCodeValidator.validate(roomId)
    } catch (error) {
      socket.emit("game:errorMessage", error.errors[0])
      return
    }

    if (!game.room || roomId !== game.room) {
      socket.emit("game:errorMessage", "Room not found")
      return
    }

    socket.emit("game:successRoom", roomId)
  },

  join: async (game, io, socket, player) => {
    try {
      await usernameValidator.validate(player.username)
    } catch (error) {
      socket.emit("game:errorMessage", error.errors[0])
      return
    }

    if (!game.room || player.room !== game.room) {
      socket.emit("game:errorMessage", "Room not found")
      return
    }
//checking if player existed previously (either by sessionToken or username)
    const existingByToken = player.sessionToken
      ? game.players.find((p) => p.sessionToken === player.sessionToken)
      : null
    const existingByUsername = game.players.find(
      (p) => p.username === player.username,
    )

//if client provides a token or same username exists, allow reattach even if started
    if (existingByToken || existingByUsername) {
      const existing = existingByToken || existingByUsername
      socket.join(game.room)
      existing.id = socket.id
      if (player.sessionToken) existing.sessionToken = player.sessionToken
      socket.emit("game:rejoinSuccess", {
        username: existing.username,
        room: existing.room,
        points: existing.points,
      })
      io.to(game.manager).emit("manager:playerRejoined", existing.id)
      io.to(game.room).emit("game:totalPlayers", game.players.length)
      return
    }

    if (game.started) {
      socket.emit("game:errorMessage", "Game already started")
      return
    }

    console.log("New Player", player)

    socket.join(player.room)

    const sessionToken = `${player.room}_${socket.id}_${Date.now()}` //create a session token tied to room and current socket id

    let playerData = {
      username: player.username,
      room: player.room,
      id: socket.id,
      points: 0,
      sessionToken, //extra field for sessionToken
    }
    socket.to(player.room).emit("manager:newPlayer", { ...playerData })

    game.players.push(playerData)

    io.to(player.room).emit("game:totalPlayers", game.players.length) //emit total players to all players in the room

    socket.emit("game:successJoin", { sessionToken })
  },

  //new function for rejoining
  rejoin: (game, io, socket, { sessionToken }) => {
    if (!sessionToken) {
      socket.emit("game:errorMessage", "Missing session token")
      return
    }

    const saved = getDisconnectedPlayer(sessionToken)
    if (!saved) {
      socket.emit("game:errorMessage", "Rejoin session expired or invalid")
      return
    }

    if (!game.room || saved.roomId !== game.room) {
      socket.emit("game:errorMessage", "Room not found")
      deleteDisconnectedPlayer(sessionToken)
      return
    }

    if (Date.now() > saved.expiresAt) {
      deleteDisconnectedPlayer(sessionToken)
      socket.emit("game:errorMessage", "Rejoin window expired")
      return
    }

    //find existing player by prior id or username and update socket id
    const existing =
      game.players.find((p) => p.sessionToken === sessionToken) ||
      game.players.find((p) => p.username === saved.username)

    if (!existing) {
      //if not found, deny rejoin
      deleteDisconnectedPlayer(sessionToken)
      socket.emit("game:errorMessage", "Player not found in game")
      return
    }

    //move socket into room and update references
    socket.join(saved.roomId)
    existing.id = socket.id
    existing.sessionToken = sessionToken
    existing.points = saved.points || existing.points || 0

    //notify player success and manager of rejoin
    socket.emit("game:rejoinSuccess", {
      username: existing.username,
      room: existing.room,
      points: existing.points,
    })
    io.to(game.manager).emit("manager:playerRejoined", existing.id)

    deleteDisconnectedPlayer(sessionToken)

    //optionally sync counts
    io.to(game.room).emit("game:totalPlayers", game.players.length)
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

    socket.emit("game:status", {
      name: "WAIT",
      data: { text: "Waiting for the players to answer" },
    })
    socket.to(game.room).emit("game:playerAnswer", game.playersAnswer.length)

    io.to(game.room).emit("game:totalPlayers", game.players.length)

    if (game.playersAnswer.length === game.players.length) {
      abortCooldown()
    }
  },
}

export default Player
