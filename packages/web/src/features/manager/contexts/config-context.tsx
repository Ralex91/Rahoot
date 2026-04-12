import type { ManagerConfig } from "@rahoot/common/types/manager"
import { createContext, useContext, type ReactNode } from "react"

const ConfigContext = createContext<ManagerConfig>({
  quizz: [],
  results: [],
})

type Props = {
  children: ReactNode
  data: ManagerConfig
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
