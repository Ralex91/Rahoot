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
      "flex-1 rounded px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100",
      active && "bg-primary hover:bg-primary/90 btn-shadow text-white",
    )}
    {...otherProps}
  >
    <div className="btn-content">{children}</div>
  </button>
)

export default ConfigTabButton
