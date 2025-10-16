import loader from "@rahoot/web/assets/loader.svg"
import Image from "next/image"

export default function Loader() {
  return <Image alt="loader" src={loader} />
}
