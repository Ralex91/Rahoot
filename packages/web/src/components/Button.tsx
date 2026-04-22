import clsx from "clsx"
import type { ButtonHTMLAttributes, PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge"

type Size = "sm" | "md" | "lg"

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & {
    size?: Size
    classNameContent?: string
  }

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1 text-sm",
  md: "p-2 text-lg",
  lg: "px-5 py-3 text-xl",
}

const Button = ({
  children,
  className,
  classNameContent,
  size = "md",
  ...otherProps
}: Props) => (
  <button
    className={twMerge(
      clsx(
        "btn-shadow bg-primary rounded-md font-semibold text-white",
        sizeClasses[size],
        className,
      ),
    )}
    {...otherProps}
  >
    <div
      className={twMerge(
        clsx(
          "btn-content flex items-center justify-center gap-2",
          classNameContent,
        ),
      )}
    >
      {children}
    </div>
  </button>
)

export default Button
