//logic for temporarily disconnected players

const disconnectedPlayers = new Map() //gonna store the player data as key value pairs (key is sessionToken and value is player data)

export function saveDisconnectedPlayer(sessionToken, data) {
  disconnectedPlayers.set(sessionToken, data)
}

export function getDisconnectedPlayer(sessionToken) {
  return disconnectedPlayers.get(sessionToken)
}

export function deleteDisconnectedPlayer(sessionToken) {
  disconnectedPlayers.delete(sessionToken)
}

//delete the player data if the player takes too long to rejoin
export function sweepExpiredDisconnectedPlayers() {
  const now = Date.now()
  for (const [token, data] of disconnectedPlayers.entries()) {
    if (!data || typeof data.expiresAt !== "number" || now > data.expiresAt) {
      disconnectedPlayers.delete(token)
    }
  }
}

export default disconnectedPlayers


