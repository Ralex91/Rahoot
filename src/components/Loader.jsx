import loader from "@/assets/loader.svg"
import Image from "next/image"

export default function Loader({ ...otherProps }) {
  return <Image src={loader} />
}
