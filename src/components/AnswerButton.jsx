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
        "text-left px-4 py-6 rounded shadow-inset flex items-center gap-3",
        className
      )}
      {...otherProps}
    >
      <Icon className="h-6 w-6" />
      <span className="drop-shadow-md">{children}</span>
    </button>
  )
}
