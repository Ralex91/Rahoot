import clsx from "clsx"
import { ButtonHTMLAttributes, ElementType, PropsWithChildren } from "react"

type Props = PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: ElementType
  }

export default function AnswerButton({
  className,
  icon: Icon,
  children,
  ...otherProps
}: Props) {
  return (
    <button
      className={clsx(
        "shadow-inset flex items-center gap-3 rounded px-4 py-6 text-left",
        className,
      )}
      {...otherProps}
    >
      <Icon className="h-6 w-6" />
      <span className="drop-shadow-md">{children}</span>
    </button>
  )
}
