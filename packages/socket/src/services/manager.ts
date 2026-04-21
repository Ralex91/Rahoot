import { EVENTS } from "@rahoot/common/constants"
import type { Socket } from "@rahoot/common/types/game/socket"
import type { SocketContext } from "@rahoot/socket/handlers/types"
import Config from "@rahoot/socket/services/config"

const getClientId = (socket: SocketContext["socket"]) =>
  socket.handshake.auth.clientId as string

export const emitConfig = (socket: SocketContext["socket"]) =>
  socket.emit(EVENTS.MANAGER.CONFIG, {
    quizz: Config.quizzMeta(),
    results: Config.resultsMeta(),
  })

class Manager {
  private loggedClients = new Set()

  isLogged(socket: Socket) {
    return this.loggedClients.has(getClientId(socket))
  }

  login(socket: Socket) {
    this.loggedClients.add(getClientId(socket))
  }

  logout(socket: Socket) {
    this.loggedClients.delete(getClientId(socket))
  }

  withAuth<T extends unknown[]>(
    socket: Socket,
    handler: (..._args: T) => void,
  ) {
    return (..._args: T) => {
      if (!this.isLogged(socket)) {
        socket.emit(EVENTS.MANAGER.UNAUTHORIZED)

        return
      }

      handler(..._args)
    }
  }
}

export default new Manager()
