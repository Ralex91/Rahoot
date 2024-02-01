import clsx from "clsx"

export default function Button({ children, className, ...otherProps }) {
  return (
    <button
      className={clsx(
        "btn-shadow rounded-md bg-primary p-2 text-lg font-semibold text-white",
        className,
      )}
      {...otherProps}
    >
      <span>{children}</span>
    </button>
  )
}
