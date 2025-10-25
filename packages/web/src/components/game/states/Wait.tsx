import { PlayerStatusDataMap } from "@rahoot/common/types/game/status"
import Loader from "@rahoot/web/components/Loader"

type Props = {
  data: PlayerStatusDataMap["WAIT"]
}

const Wait = ({ data: { text } }: Props) => (
  <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center">
    <Loader />
    <h2 className="mt-5 text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl lg:text-5xl">
      {text}
    </h2>
  </section>
)

export default Wait
