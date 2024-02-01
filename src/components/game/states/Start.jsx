import { useSocketContext } from "@/context/socket"
import { useState } from "react"

export default function Start({ data: { text, inviteCode } }) {
  const { socket } = useSocketContext()
  const [playerList, setPlayerList] = useState([])

  socket.on("manager:newPlayer", (player) => {
    setPlayerList([...playerList, player])
  })

  return (
    <section className="max-w-7xl mx-auto w-full flex-1 relative items-center justify-center flex flex-col px-2">
      <div className="py-4 px-6 mb-10 rotate-3 bg-white rounded-md text-6xl font-extrabold">
        {inviteCode}
      </div>

      <h2 className="text-white font-bold text-4xl drop-shadow-lg mb-4">
        {text}
      </h2>

      <div className="flex flex-wrap gap-3">
        {playerList.map((player) => (
          <div
            key={player.id}
            className="py-3 px-4 bg-primary shadow-inset rounded-md text-white font-bold"
            onClick={() => socket.emit("manager:kickPlayer", player.id)}
          >
            <span className="drop-shadow-md text-xl hover:line-through cursor-pointer">
              {player.username}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
