import type { GameResultMeta, QuizzMeta } from "@razzia/common/types/game"

export interface ManagerConfig {
  quizz: QuizzMeta[]
  results: GameResultMeta[]
}
