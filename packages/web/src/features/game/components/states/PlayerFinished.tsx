import type { CommonStatusDataMap } from "@rahoot/common/types/game/status"
import { usePlayerStore } from "@rahoot/web/features/game/stores/player"

type Props = {
  data: CommonStatusDataMap["FINISHED"]
}

const ordinal = (n: number) => {
  if (n === 1) {
    return "1st"
  }

  if (n === 2) {
    return "2nd"
  }

  if (n === 3) {
    return "3rd"
  }

  return `${n}th`
}

const PlayerFinished = ({ data: { rank, subject } }: Props) => {
  const { player } = usePlayerStore()

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 px-4">
      <p className="text-center text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
        {subject}
      </p>

      <p className="text-center text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
        {rank ? ordinal(rank) : "—"} place
      </p>

      <p className="mt-2 rounded bg-black/40 px-6 py-2 text-2xl font-bold text-white">
        {player?.points ?? 0} pts
      </p>
    </div>
  )
}

export default PlayerFinished
