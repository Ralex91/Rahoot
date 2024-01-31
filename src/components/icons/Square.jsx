export default function Square({ className, fill = "#FFF" }) {
  return (
    <svg
      className={className}
      fill={fill}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="48" y="48" width="416" height="416" />
    </svg>
  )
}
