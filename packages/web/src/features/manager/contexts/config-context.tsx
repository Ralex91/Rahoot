import type { ManagerConfig } from "@razzia/common/types/manager"
import { createContext, useContext, type ReactNode } from "react"

const ConfigContext = createContext<ManagerConfig>({
  quizz: [],
  results: [],
})

interface Props {
  children: ReactNode
  data: ManagerConfig
}

export const ConfigProvider = ({ children, data }: Props) => (
  <ConfigContext.Provider value={data}>{children}</ConfigContext.Provider>
)

export const useConfig = () => {
  const context = useContext(ConfigContext)

  // oxlint-disable-next-line typescript/no-unnecessary-condition
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }

  return context
}
