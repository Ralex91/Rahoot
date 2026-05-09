import clsx from "clsx"
import React from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: "sm" | "md"
}

const Input = ({
  className,
  type = "text",
  variant = "md",
  ...otherProps
}: Props) => (
  <input
    type={type}
    className={clsx(
      "focus:outline-primary rounded-lg font-semibold outline-2 outline-gray-300",
      variant === "md" && "p-2 text-lg",
      variant === "sm" && "px-3 py-2 text-sm",
      className,
    )}
    {...otherProps}
  />
)

export default Input
