import loader from "@rahoot/web/assets/loader.svg"
import Image from "next/image"

type Props = {
  className?: string
}

const Loader = ({ className }: Props) => (
  <Image className={className} alt="loader" src={loader} />
)

export default Loader
