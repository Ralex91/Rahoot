let cooldownTimeout
let cooldownResolve

export const abortCooldown = () => {
  clearInterval(cooldownTimeout)
  cooldownResolve()
}

function cooldown(ms, io, room) {
  let count = ms - 1

  return new Promise((resolve) => {
    cooldownResolve = resolve

    cooldownTimeout = setInterval(() => {
      if (!count) {
        clearInterval(cooldownTimeout)
        resolve()
      }
      io.to(room).emit("game:cooldown", count)
      count -= 1
    }, 1000)
  })
}

const sleep = (sec) => new Promise((r) => setTimeout(r, sec * 1000))

export const startRound = async (game, io, socket) => {
  const question = game.questions[game.currentQuestion]

  io.to(game.room).emit("game:updateQuestion", {
    current: game.currentQuestion + 1,
    total: game.questions.length,
  })

  io.to(game.room).emit("game:status", {
    name: "SHOW_QUESTION",
    data: {
      question: question.question,
      number: game.currentQuestion + 1,
      image: question.image,
      cooldown: 6,
    },
  })

  await sleep(6)

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

  game.players.map(async (player) => {
    let playerAnswer = await game.playersAnswer.find((p) => p.id === player.id)

    let isCorrect = playerAnswer
      ? playerAnswer.answer === question.solution
      : false

    let points =
      (isCorrect && Math.round(playerAnswer && playerAnswer.points)) || 0

    game.players.find((p) => p.id === player.id).points += points

    setTimeout(() => {
      let rank =
        game.players
          .sort((a, b) => b.points - a.points)
          .findIndex((p) => p.id === player.id) + 1

      io.to(player.id).emit("game:status", {
        name: "SHOW_RESULT",
        data: {
          correct: isCorrect,
          message: isCorrect ? "Nice !" : "Too bad",
          points: points,
          myPoints: player.points,
          totalPlayer: game.players.length,
          rank: rank,
        },
      })
    }, 200)
  })

  let totalParType = {}

  game.playersAnswer.forEach(({ answer }) => {
    totalParType[answer] = (totalParType[answer] || 0) + 1
  })

  // Manager
  io.to(game.manager).emit("game:status", {
    name: "SHOW_RESPONSES",
    data: {
      question: game.questions[game.currentQuestion].question,
      responses: totalParType,
      correct: game.questions[game.currentQuestion].solution,
      answers: game.questions[game.currentQuestion].answers,
      image: game.questions[game.currentQuestion].image,
    },
  })

  game.playersAnswer = []
}
