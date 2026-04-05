import type { QuizzWithId } from "@rahoot/common/types/game"
import { createContext, useContext, type ReactNode } from "react"

interface SettingsContextValue {
  quizz: QuizzWithId[]
}

const SettingsContext = createContext<SettingsContextValue>({
  quizz: [],
})

type Props = {
  children: ReactNode
  data: SettingsContextValue
}

export const SettingsProvider = ({ children, data }: Props) => (
  <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>
)

export const useSettings = () => {
  const context = useContext(SettingsContext)

  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }

  return context
}
