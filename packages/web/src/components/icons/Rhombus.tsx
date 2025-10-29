type Props = {
  className?: string
  fill?: string
}

const Rhombus = ({ className, fill = "#FFF" }: Props) => (
  <svg
    className={className}
    fill={fill}
    viewBox="-56.32 -56.32 624.64 624.64"
    xmlns="http://www.w3.org/2000/svg"
    transform="rotate(45)"
  >
    <g strokeWidth="0" />

    <g strokeLinecap="round" strokeLinejoin="round" />

    <g>
      <rect x="48" y="48" width="416" height="416" />
    </g>
  </svg>
)

export default Rhombus
