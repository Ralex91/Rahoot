import clsx from "clsx"

export default function Input({ className, ...otherProps }) {
  return (
    <input
      className={clsx(
        "rounded-sm p-2 text-lg font-semibold outline outline-2 outline-gray-300",
        className,
      )}
      {...otherProps}
    />
  )
}
