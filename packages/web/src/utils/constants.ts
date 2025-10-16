import Answers from "@rahoot/web/components/game/states/Answers"
import Leaderboard from "@rahoot/web/components/game/states/Leaderboard"
import Podium from "@rahoot/web/components/game/states/Podium"
import Prepared from "@rahoot/web/components/game/states/Prepared"
import Question from "@rahoot/web/components/game/states/Question"
import Responses from "@rahoot/web/components/game/states/Responses"
import Result from "@rahoot/web/components/game/states/Result"
import Room from "@rahoot/web/components/game/states/Room"
import Start from "@rahoot/web/components/game/states/Start"
import Wait from "@rahoot/web/components/game/states/Wait"

import { Status } from "@rahoot/common/types/game/status"
import Circle from "@rahoot/web/components/icons/Circle"
import Rhombus from "@rahoot/web/components/icons/Rhombus"
import Square from "@rahoot/web/components/icons/Square"
import Triangle from "@rahoot/web/components/icons/Triangle"

export const ANSWERS_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-green-500",
]

export const ANSWERS_ICONS = [Triangle, Rhombus, Circle, Square]

export const GAME_STATES = {
  status: {
    name: Status.WAIT,
    data: { text: "Waiting for the players" },
  },
  question: {
    current: 1,
    total: null,
  },
}

export const GAME_STATE_COMPONENTS = {
  [Status.SELECT_ANSWER]: Answers,
  [Status.SHOW_QUESTION]: Question,
  [Status.WAIT]: Wait,
  [Status.SHOW_START]: Start,
  [Status.SHOW_RESULT]: Result,
  [Status.SHOW_PREPARED]: Prepared,
}

export const GAME_STATE_COMPONENTS_MANAGER = {
  ...GAME_STATE_COMPONENTS,
  [Status.SHOW_ROOM]: Room,
  [Status.SHOW_RESPONSES]: Responses,
  [Status.SHOW_LEADERBOARD]: Leaderboard,
  [Status.FINISHED]: Podium,
}

export const SFX_ANSWERS_MUSIC = "/sounds/answersMusic.mp3"
export const SFX_ANSWERS_SOUND = "/sounds/answersSound.mp3"
export const SFX_RESULTS_SOUND = "/sounds/results.mp3"
export const SFX_SHOW_SOUND = "/sounds/show.mp3"
export const SFX_BOUMP_SOUND = "/sounds/boump.mp3"
export const SFX_PODIUM_THREE = "/sounds/three.mp3"
export const SFX_PODIUM_SECOND = "/sounds/second.mp3"
export const SFX_PODIUM_FIRST = "/sounds/first.mp3"
export const SFX_SNEAR_ROOL = "/sounds/snearRoll.mp3"
