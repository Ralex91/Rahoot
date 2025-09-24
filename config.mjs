export const WEBSOCKET_PUBLIC_URL = "http://localhost:5505/"
export const WEBSOCKET_SERVER_PORT = 5505

const QUIZZ_CONFIG = {
  password: "PASSWORD",
  subject: "Le Grand Quiz Nantais",
  questions: [
  {
    question: "Quel surnom est donné à Nantes grâce à son château emblématique ?",
    answers: [
      "La Cité des Ducs",
      "La Ville Lumière",
      "La Capitale Verte",
      "La Cité Médiévale"
    ],
    solution: 0,
    cooldown: 5,
    time: 15,
    explanation: "Nantes est surnommée la « Cité des Ducs » car elle fut la résidence des ducs de Bretagne, avec le château des ducs de Bretagne en plein centre-ville."
  },
  {
    question: "Quel célèbre éléphant mécanique peut-on voir sur l’Île de Nantes ?",
    answers: [
      "L'Éléphant de Jules Verne",
      "Le Grand Éléphant des Machines de l’Île",
      "L’Éléphant d’Atlantide",
      "L’Éléphant de Loire"
    ],
    solution: 1,
    cooldown: 5,
    time: 15,
    explanation: "Le Grand Éléphant, création des Machines de l’Île, transporte les visiteurs à dos de machine dans un spectacle unique au monde."
  },
  {
    question: "Quel auteur nantais est connu dans le monde entier pour ses romans d’aventures ?",
    answers: [
      "Victor Hugo",
      "Jules Verne",
      "Gustave Flaubert",
      "Alexandre Dumas"
    ],
    solution: 1,
    cooldown: 5,
    time: 15,
    explanation: "Jules Verne, né à Nantes en 1828, est l’auteur de classiques comme « Vingt mille lieues sous les mers » et « Le Tour du monde en quatre-vingts jours »."
  },
  {
    question: "Quel fleuve traverse Nantes ?",
    answers: [
      "La Seine",
      "La Loire",
      "La Garonne",
      "Le Rhône"
    ],
    solution: 1,
    cooldown: 5,
    time: 15,
    explanation: "La Loire, le plus long fleuve de France, traverse Nantes et se jette ensuite dans l’océan Atlantique."
  },
  {
    question: "Quel grand équipement culturel de Nantes accueille concerts et congrès ?",
    answers: [
      "Le Stade de la Beaujoire",
      "La Cité des Congrès",
      "Le Château des Ducs",
      "La Tour Bretagne"
    ],
    solution: 1,
    cooldown: 5,
    time: 15,
    explanation: "La Cité des Congrès de Nantes est un lieu majeur accueillant conférences, concerts, salons et spectacles au cœur de la ville."
  },
  {
    question: "Quelle spécialité culinaire de Nantes est à base de biscuits ?",
    answers: [
      "Le kouign-amann",
      "Le gâteau nantais",
      "Les sablés nantais",
      "La crêpe au beurre salé"
    ],
    solution: 2,
    cooldown: 5,
    time: 15,
    explanation: "Les sablés nantais, connus pour leur goût beurré, sont une spécialité locale créée au XIXe siècle."
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
