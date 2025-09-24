export const WEBSOCKET_PUBLIC_URL = "http://localhost:5505/"
export const WEBSOCKET_SERVER_PORT = 5505

const QUIZZ_CONFIG = {
  password: "PASSWORD",
  subject: "Adobe",
  questions: [
    {
      question: "Who are the founders of Adobe?",
      answers: [
        "Steve Jobs and Charles Geschke",
        "Jhon Warnock and Charles Geschke",
        "Jhon Jonse and Charles Geskie",
        "Bill Gate",
      ],
      solution: 1,
      cooldown: 5,
      time: 15,
      explanation:
        "Adobe a été fondée par **John Warnock** et **Charles Geschke** en 1982, autour du langage PostScript.",
    },
    {
      question: "What is Adobe's most famous software?",
      answers: ["Encore", "AfterEffect", "Creative Cloud", "Photoshop"],
      image:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500&auto=webp",
      solution: 3,
      cooldown: 5,
      time: 15,
      explanation:
        "Photoshop (1988) est devenu un standard mondial pour la retouche et la création d’images.",
    },
  ],
}

// DONT CHANGE
export const GAME_STATE_INIT = {
  started: false,
  players: [],
  playersAnswer: [],
  manager: null,
  room: null,
  currentQuestion: 0,
  roundStartTime: 0,
  ...QUIZZ_CONFIG,
}
