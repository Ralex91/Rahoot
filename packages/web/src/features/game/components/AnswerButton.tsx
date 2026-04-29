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
      <Icon className="size-4 shrink-0 md:size-6" />
      <p className="w-full flex-1 text-sm break-all drop-shadow-md sm:text-base">
        {children}
      </p>
      {correct !== undefined && (
        <CorrectIcon className="size-4 stroke-6 sm:size-6" />
      )}
    </button>
  )
}

export default AnswerButton
