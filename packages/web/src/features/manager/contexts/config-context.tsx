import type { QuizzMeta } from "@rahoot/common/types/game"
import { createContext, useContext, type ReactNode } from "react"

interface ConfigContextValue {
  quizz: QuizzMeta[]
}

const ConfigContext = createContext<ConfigContextValue>({
  quizz: [],
})

type Props = {
  children: ReactNode
  data: ConfigContextValue
}

export const ConfigProvider = ({ children, data }: Props) => (
  <ConfigContext.Provider value={data}>{children}</ConfigContext.Provider>
)

export const useConfig = () => {
  const context = useContext(ConfigContext)

  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }

  return context
}
