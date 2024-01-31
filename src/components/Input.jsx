import clsx from "clsx"

export default function Input({ className, ...otherProps }) {
  return (
    <input
      className={clsx(
        "outline outline-gray-300 outline-2 rounded-sm p-2 font-semibold text-lg",
        className
      )}
      {...otherProps}
    />
  )
}
