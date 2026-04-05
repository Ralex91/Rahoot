import type { ManagerConfig } from "@rahoot/common/types/manager"
import Card from "@rahoot/web/components/Card"
import ConfigManageQuizz from "@rahoot/web/features/manager/components/configurations/ConfigManageQuizz"
import ConfigSelectQuizz from "@rahoot/web/features/manager/components/configurations/ConfigSelectQuizz"
import ConfigTabButton from "@rahoot/web/features/manager/components/configurations/ConfigTabButton"
import { SettingsProvider } from "@rahoot/web/features/manager/contexts/settings-context"
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
  const TabComponent = tabs[selectedTab].component

  const handleSelect = (index: number) => () => {
    setSelectedTab(index)
  }

  return (
    <SettingsProvider data={data}>
      <Card className="max-h-[80svh] min-w-md">
        <p className="mb-4 text-lg font-semibold">Configurations</p>
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
    </SettingsProvider>
  )
}

export default Configurations
