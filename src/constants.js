import Answers from "@/components/game/states/Answers"
import Leaderboard from "@/components/game/states/Leaderboard"
import Prepared from "@/components/game/states/Prepared"
import Question from "@/components/game/states/Question"
import Result from "@/components/game/states/Result"
import Room from "./components/game/states/Room"
import Podium from "./components/game/states/Podium"
import Wait from "@/components/game/states/Wait"
import Start from "@/components/game/states/Start"

import Circle from "@/components/icons/Circle"
import Triangle from "@/components/icons/Triangle"
import Square from "@/components/icons/Square"
import Rhombus from "@/components/icons/Rhombus"

export const WEBSOCKET_URL = "http://localhost:5157"

export const ANSWERS_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-green-500",
]

export const ANSWERS_ICONS = [Triangle, Rhombus, Circle, Square]

export const GAME_STATES = {
  status: {
    name: "WAIT",
    data: { text: "Waiting for the players" },
  },
  question: {
    current: 1,
    total: null,
  },
}

export const GAME_STATE_COMPONENTS = {
  SELECT_ANSWER: Answers,
  SHOW_QUESTION: Question,
  WAIT: Wait,
  SHOW_START: Start,
  SHOW_RESULT: Result,
  SHOW_PREPARED: Prepared,
}

export const GAME_STATE_COMPONENTS_MANAGER = {
  ...GAME_STATE_COMPONENTS,
  SHOW_ROOM: Room,
  SHOW_RESPONSES: Answers,
  SHOW_LEADERBOARD: Leaderboard,
  FINISH: Podium,
}
