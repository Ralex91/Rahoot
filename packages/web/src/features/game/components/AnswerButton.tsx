import clsx from "clsx"
import { Check, X } from "lucide-react"
import type {
  ButtonHTMLAttributes,
  ElementType,
  PropsWithChildren,
} from "react"

type Props = PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: ElementType
    correct?: boolean
  }

const AnswerButton = ({
  className,
  icon: Icon,
  children,
  correct,
  ...otherProps
}: Props) => {
  const CorrectIcon = correct ? Check : X

  return (
    <button
      className={clsx(
        "shadow-inset flex items-center gap-3 rounded px-4 py-6 text-left",
        className,
      )}
      {...otherProps}
    >
      <Icon className="h-6 w-6 shrink-0" />
      <p className="w-full flex-1 break-all drop-shadow-md">{children}</p>
      {correct !== undefined && <CorrectIcon className="size-6 stroke-6" />}
    </button>
  )
}

export default AnswerButton
