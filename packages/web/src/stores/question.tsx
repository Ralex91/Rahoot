import { GameUpdateQuestion } from "@rahoot/common/types/game"
import { create } from "zustand"

type QuestionStore = {
  questionStates: GameUpdateQuestion | null
  setQuestionStates: (_state: GameUpdateQuestion) => void
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questionStates: null,
  setQuestionStates: (state: GameUpdateQuestion) =>
    set({ questionStates: state }),
}))
