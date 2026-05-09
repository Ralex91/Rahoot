import type { GameUpdateQuestion } from "@razzia/common/types/game"
import { create } from "zustand"

interface QuestionStore {
  questionStates: GameUpdateQuestion | null
  setQuestionStates: (_state: GameUpdateQuestion | null) => void
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questionStates: null,
  setQuestionStates: (state) => set({ questionStates: state }),
}))
