import clsx from "clsx"
import type {
  ButtonHTMLAttributes,
  ElementType,
  PropsWithChildren,
} from "react"

type Props = PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: ElementType
  }

const AnswerButton = ({
  className,
  icon: Icon,
  children,
  ...otherProps
}: Props) => (
  <button
    className={clsx(
      "shadow-inset flex min-h-24 items-center gap-3 rounded px-3 py-4 text-left text-sm sm:min-h-28 sm:px-4 sm:py-6 sm:text-base md:text-lg",
      className,
    )}
    {...otherProps}
  >
    <Icon className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
    <span className="min-w-0 break-words drop-shadow-md">{children}</span>
  </button>
)

export default AnswerButton
