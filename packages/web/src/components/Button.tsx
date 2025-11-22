import clsx from "clsx"
import { ButtonHTMLAttributes, PropsWithChildren } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren

const Button = ({ children, className, disabled, ...otherProps }: Props) => (
  <button
    className={clsx(
      "btn-shadow bg-primary rounded-md p-2 text-lg font-semibold text-white transition-opacity",
      disabled && "cursor-not-allowed opacity-50",
      className,
    )}
    disabled={disabled}
    {...otherProps}
  >
    <span>{children}</span>
  </button>
)

export default Button
