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
    },
    {
      question: "What is Adobe's most famous software?",
      answers: ["Encore", "AfterEffect", "Creative Cloud", "Photoshop"],
      image:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500&auto=webp",
      solution: 3,
      cooldown: 5,
      time: 15,
    },
    {
      question: "When was Adobe created?",
      answers: ["2000", "1982", "2003", "1987"],
      solution: 1,
      cooldown: 5,
      time: 15,
    },
    {
      question: "Where is headquertes located?",
      answers: [
        "San Jose, California",
        "Bookworm, Cascui",
        "DowTown, Texas",
        "Tokyo, Japan",
      ],
      solution: 0,
      cooldown: 5,
      time: 15,
    },
    {
      question: "How many employees at Adobe?",
      answers: [
        "15,423 employees",
        "30,803 employees",
        "25,988 employees",
        "5,073 employees",
      ],
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=500&auto=webp",
      solution: 2,
      cooldown: 5,
      time: 15,
    },
    {
      question: "Who is the Current CEO?",
      answers: [
        "Jhon Warnock",
        "Victor Newway",
        "Mark Java",
        "Shantanu Narayen",
      ],
      image:
        "https://images.unsplash.com/photo-1435348773030-a1d74f568bc2?q=80&w=500&auto=webp",
      solution: 3,
      cooldown: 5,
      time: 15,
    },
    {
      question: "Adobe's core business is focused on?",
      answers: [
        "Creative Software",
        "Video Game",
        "Logistics software",
        "Other",
      ],
      image:
        "https://images.unsplash.com/photo-1582736317407-371893d9e146?q=80&w=500&auto=webp",
      solution: 0,
      cooldown: 5,
      time: 15,
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
