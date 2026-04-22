import type { PropsWithChildren, ReactNode } from "react"

type LabelProps = {
  icon: ReactNode
  label: string
  unit?: string
}

const Label = ({ icon, label, unit = "sec" }: LabelProps) => (
  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
    {icon}
    {label}
    <span className="text-xs font-normal text-gray-400">({unit})</span>
  </div>
)

const Description = ({ children }: { children: string }) => (
  <p className="text-xs text-gray-400">{children}</p>
)

const ConfigField = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col gap-1.5">{children}</div>
)

ConfigField.Label = Label
ConfigField.Description = Description

export default ConfigField
