type Props = {
  className?: string
  fill?: string
}

const Triangle = ({ className, fill = "#FFF" }: Props) => (
  <svg
    className={className}
    fill={fill}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon points="256 32 20 464 492 464 256 32" />
  </svg>
)

export default Triangle
