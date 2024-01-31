import clsx from "clsx"

export default function Button({ children, className, ...otherProps }) {
  return (
    <button
      className={clsx(
        "p-2 bg-primary rounded-md text-white font-semibold text-lg btn-shadow",
        className
      )}
      {...otherProps}
    >
      <span>{children}</span>
    </button>
  )
}
