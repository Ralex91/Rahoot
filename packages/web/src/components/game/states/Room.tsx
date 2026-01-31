"use client"

import { Player } from "@rahoot/common/types/game"
import { ManagerStatusDataMap } from "@rahoot/common/types/game/status"
import { useEvent, useSocket } from "@rahoot/web/contexts/socketProvider"
import { useManagerStore } from "@rahoot/web/stores/manager"
import { useState } from "react"
import QRCode from "react-qr-code"

type Props = {
  data: ManagerStatusDataMap["SHOW_ROOM"]
}

const Room = ({ data: { text, inviteCode } }: Props) => {
  const { gameId } = useManagerStore()
  const { socket, webUrl } = useSocket()
  const { players } = useManagerStore()
  const [playerList, setPlayerList] = useState<Player[]>(players)
  const [totalPlayers, setTotalPlayers] = useState(0)

  useEvent("manager:newPlayer", (player) => {
    setPlayerList([...playerList, player])
  })

  useEvent("manager:removePlayer", (playerId) => {
    setPlayerList(playerList.filter((p) => p.id !== playerId))
  })

  useEvent("manager:playerKicked", (playerId) => {
    setPlayerList(playerList.filter((p) => p.id !== playerId))
  })

  useEvent("game:totalPlayers", (total) => {
    setTotalPlayers(total)
  })

  const handleKick = (playerId: string) => () => {
    if (!gameId) {
      return
    }

    socket?.emit("manager:kickPlayer", {
      gameId,
      playerId,
    })
  }

  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-2">
      <div className="mb-10 flex flex-col-reverse items-center gap-3 md:flex-row md:items-stretch">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="game-pin-out flex flex-col justify-center rounded-md bg-white px-6 py-4">
            <p className="text-2xl font-bold">Join the game at</p>
            <p className="w-60 text-lg font-extrabold break-all">{webUrl}</p>
          </div>

          <div className="game-pin-in flex flex-col justify-center rounded-md bg-white px-6 py-4 text-center md:rounded-l-none md:text-left">
            <p className="text-2xl font-bold">Game PIN:</p>
            <p className="text-6xl font-extrabold">{inviteCode}</p>
          </div>
        </div>

        <div className="flex h-40 shrink-0 rounded-md bg-white p-2">
          <QRCode
            className="h-auto w-auto"
            value={`${webUrl}?pin=${inviteCode}`}
          />
        </div>
      </div>

      <h2 className="mb-4 text-4xl font-bold text-white drop-shadow-lg">
        {text}
      </h2>

      <div className="mb-6 flex items-center justify-center rounded-full bg-black/40 px-6 py-3">
        <span className="text-2xl font-bold text-white drop-shadow-md">
          Players Joined: {totalPlayers}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {playerList.map((player) => (
          <div
            key={player.id}
            className="shadow-inset bg-primary rounded-md px-4 py-3 font-bold text-white"
            onClick={handleKick(player.id)}
          >
            <span className="cursor-pointer text-3xl drop-shadow-md hover:line-through">
              {player.username}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Room
