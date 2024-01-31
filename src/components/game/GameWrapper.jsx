import Image from "next/image"
import Button from "@/components/Button"
import background from "@/assets/2238431_1694.jpg"
import { usePlayerContext } from "@/context/player"

export default function GameWrapper({ children }) {
  const { player } = usePlayerContext()

  return (
    <section className="relative flex justify-between flex-col w-full min-h-screen">
      <div className="fixed h-full w-full top-0 left-0 bg-orange-600 opacity-70 -z-10">
        <Image
          className="object-cover h-full w-full opacity-60 pointer-events-none"
          src={background}
        />
      </div>

      <div className="p-4 w-full flex justify-between">
        <div className="bg-white shadow-inset text-black px-4 font-bold rounded-md flex items-center text-lg">
          1/10
        </div>
        <Button className="bg-white !text-black px-4">Skip</Button>
      </div>

      {children}

      <div className="bg-white py-2 px-4 flex items-center text-lg justify-between font-bold text-white">
        <p className="text-gray-800">{!!player && player.username}</p>
        <div className="bg-gray-800 rounded-sm py-1 px-3 text-lg">
          {!!player && player.points}
        </div>
      </div>
    </section>
  )
}
