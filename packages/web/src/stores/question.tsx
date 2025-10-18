/* eslint-disable no-unused-vars */
import { GameUpdateQuestion } from "@rahoot/common/types/game"
import { create } from "zustand"

type QuestionStore = {
  questionStates: GameUpdateQuestion | null
  setQuestionStates: (state: GameUpdateQuestion) => void
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questionStates: null,
  setQuestionStates: (state: GameUpdateQuestion) =>
    set({ questionStates: state }),
}))
