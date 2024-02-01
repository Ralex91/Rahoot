import clsx from "clsx"
import Triangle from "./icons/Triangle"

export default function AnswerButton({
  className,
  icon: Icon,
  children,
  ...otherProps
}) {
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
