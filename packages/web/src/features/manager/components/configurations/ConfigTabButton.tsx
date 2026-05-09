import clsx from "clsx"
import type { ButtonHTMLAttributes, PropsWithChildren } from "react"

const ConfigTabButton = ({
  children,
  active,
  ...otherProps
}: ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & { active?: boolean }) => (
  <button
    className={clsx(
      "flex-1 rounded-lg px-4 py-2 font-semibold text-gray-600 hover:bg-gray-200",
      active && "bg-primary hover:bg-primary/90 text-white",
    )}
    {...otherProps}
  >
    <div>{children}</div>
  </button>
)

export default ConfigTabButton
