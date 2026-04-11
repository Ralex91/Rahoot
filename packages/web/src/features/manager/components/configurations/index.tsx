import { EVENTS } from "@rahoot/common/constants"
import type { ManagerConfig } from "@rahoot/common/types/manager"
import Card from "@rahoot/web/components/Card"
import ConfigManageQuizz from "@rahoot/web/features/manager/components/configurations/ConfigManageQuizz"
import ConfigSelectQuizz from "@rahoot/web/features/manager/components/configurations/ConfigSelectQuizz"
import ConfigTabButton from "@rahoot/web/features/manager/components/configurations/ConfigTabButton"
import { ConfigProvider } from "@rahoot/web/features/manager/contexts/config-context"
import { useSocket } from "@rahoot/web/features/game/contexts/socket-context"
import { useManagerStore } from "@rahoot/web/features/game/stores/manager"
import { LogOut } from "lucide-react"
import { useState } from "react"

const tabs = [
  {
    name: "Play",
    component: ConfigSelectQuizz,
  },
  {
    name: "Quizz",
    component: ConfigManageQuizz,
  },
]

type Props = {
  data: ManagerConfig
}

const Configurations = ({ data }: Props) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const { reset } = useManagerStore()
  const { socket } = useSocket()
  const TabComponent = tabs[selectedTab].component

  const handleSelect = (index: number) => () => {
    setSelectedTab(index)
  }

  const handleLogout = () => {
    socket?.emit(EVENTS.MANAGER.LOGOUT)
    reset()
  }

  return (
    <ConfigProvider data={data}>
      <Card className="max-h-[80svh] min-w-md">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-semibold">Configurations</p>
          <button
            className="rounded-sm p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="size-4" />
          </button>
        </div>
        <div className="flex shrink-0 overflow-hidden rounded-md border border-gray-200">
          {tabs.map((tab, index) => (
            <ConfigTabButton
              key={tab.name}
              active={index === selectedTab}
              onClick={handleSelect(index)}
            >
              {tab.name}
            </ConfigTabButton>
          ))}
        </div>
        <hr className="my-4 text-gray-100" />
        <div className="overflow-auto p-1">
          <TabComponent />
        </div>
      </Card>
    </ConfigProvider>
  )
}

export default Configurations
