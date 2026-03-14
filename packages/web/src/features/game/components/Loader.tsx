import loader from "@rahoot/web/assets/loader.svg"

type Props = {
  className?: string
}

const Loader = ({ className }: Props) => (
  <img className={className} alt="loader" src={loader} />
)

export default Loader
