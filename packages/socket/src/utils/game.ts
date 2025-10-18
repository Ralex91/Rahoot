import { Socket } from "@rahoot/common/types/game/socket"
import Game from "@rahoot/socket/services/game"

export const withGame = <T>(
  gameId: string | undefined,
  socket: Socket,
  games: Game[],
  handler: (game: Game) => T
): T | void => {
  let game = null

  if (gameId) {
    game = games.find((g) => g.gameId === gameId)
  } else {
    game = games.find(
      (g) =>
        g.players.find((p) => p.id === socket.id) || g.manager.id === socket.id
    )
  }

  if (!game) {
    socket.emit("game:errorMessage", "Game not found")
    return
  }

  return handler(game)
}

export const createInviteCode = (length = 6) => {
  let result = ""
  const characters = "0123456789"
  const charactersLength = characters.length

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters.charAt(randomIndex)
  }

  return result
}

export const timeToPoint = (startTime: number, secondes: number): number => {
  let points = 1000

  const actualTime = Date.now()
  const tempsPasseEnSecondes = (actualTime - startTime) / 1000

  points -= (1000 / secondes) * tempsPasseEnSecondes
  points = Math.max(0, points)

  return points
}

export const findPlayerGameByClientId = (clientId: string, games: Game[]) => {
  const playerGame = games.find((g) =>
    g.players.find((p) => p.clientId === clientId)
  )

  if (playerGame) {
    return playerGame
  }

  return null
}

export const findManagerGameByClientId = (clientId: string, games: Game[]) => {
  const managerGame = games.find((g) => g.manager.clientId === clientId)

  if (managerGame) {
    return managerGame
  }

  return null
}
