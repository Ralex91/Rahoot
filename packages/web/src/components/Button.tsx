import clsx from "clsx"
import type { ButtonHTMLAttributes, PropsWithChildren } from "react"

type Size = "sm" | "md" | "lg"

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & {
    size?: Size
  }

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1 text-sm",
  md: "p-2 text-lg",
  lg: "px-5 py-3 text-xl",
}

const Button = ({ children, className, size = "md", ...otherProps }: Props) => (
  <button
    className={clsx(
      "btn-shadow bg-primary rounded-md font-semibold text-white",
      sizeClasses[size],
      className,
    )}
    {...otherProps}
  >
    <span>{children}</span>
  </button>
)

export default Button
