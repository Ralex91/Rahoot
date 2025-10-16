import clsx from "clsx"
import React from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement>

export default function Input({
  className,
  type = "text",
  ...otherProps
}: Props) {
  return (
    <input
      type={type}
      className={clsx(
        "rounded-sm p-2 text-lg font-semibold outline-2 outline-gray-300",
        className,
      )}
      {...otherProps}
    />
  )
}
