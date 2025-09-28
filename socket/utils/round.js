import { cooldown, sleep } from "./cooldown.js"

export const startRound = async (game, io) => {
  const question = game.questions[game.currentQuestion]

  if (!game.started) {
    return
  }

  io.to(game.room).emit("game:updateQuestion", {
    current: game.currentQuestion + 1,
    total: game.questions.length,
  })

  io.to(game.room).emit("game:status", {
    name: "SHOW_PREPARED",
    data: {
      totalAnswers: game.questions[game.currentQuestion].answers.length,
      questionNumber: game.currentQuestion + 1,
    },
  })

  await sleep(2)

  if (!game.started) {
    return
  }

  io.to(game.room).emit("game:status", {
    name: "SHOW_QUESTION",
    data: {
      question: question.question,
      image: question.image,
      cooldown: question.cooldown,
    },
  })

  await sleep(question.cooldown)

  if (!game.started) {
    return
  }

  game.roundStartTime = Date.now()

  io.to(game.room).emit("game:status", {
    name: "SELECT_ANSWER",
    data: {
      question: question.question,
      answers: question.answers,
      image: question.image,
      time: question.time,
      totalPlayer: game.players.length,
    },
  })

  await cooldown(question.time, io, game.room)

  if (!game.started) {
    return
  }

  game.players.map(async (player) => {
    const playerAnswer = await game.playersAnswer.find(
      (p) => p.id === player.id,
    )

    const isCorrect = playerAnswer
      ? playerAnswer.answer === question.solution
      : false

    const points =
      (isCorrect && Math.round(playerAnswer && playerAnswer.points)) || 0

    player.points += points

    const sortPlayers = game.players.sort((a, b) => b.points - a.points)

    const rank = sortPlayers.findIndex((p) => p.id === player.id) + 1
    const aheadPlayer = sortPlayers[rank - 2]

    io.to(player.id).emit("game:status", {
      name: "SHOW_RESULT",
      data: {
        correct: isCorrect,
        message: isCorrect ? "Nice !" : "Too bad",
        points,
        myPoints: player.points,
        rank,
        aheadOfMe: aheadPlayer ? aheadPlayer.username : null,
      },
    })
  })

  const totalType = {}

  game.playersAnswer.forEach(({ answer }) => {
    totalType[answer] = (totalType[answer] || 0) + 1
  })

  // Manager
  io.to(game.manager).emit("game:status", {
    name: "SHOW_RESPONSES",
    data: {
      question: game.questions[game.currentQuestion].question,
      responses: totalType,
      correct: game.questions[game.currentQuestion].solution,
      answers: game.questions[game.currentQuestion].answers,
      image: game.questions[game.currentQuestion].image,
    },
  })

  game.playersAnswer = []
}
