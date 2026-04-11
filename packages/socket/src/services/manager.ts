import { EVENTS } from "@rahoot/common/constants"
import type { SocketContext } from "@rahoot/socket/handlers/types"
import Config from "@rahoot/socket/services/config"

const loggedManagers = new Set<string>()

export const getClientId = (socket: SocketContext["socket"]) =>
  socket.handshake.auth.clientId as string

export const isLogged = (socket: SocketContext["socket"]) =>
  loggedManagers.has(getClientId(socket))

export const login = (socket: SocketContext["socket"]) =>
  loggedManagers.add(getClientId(socket))

export const logout = (socket: SocketContext["socket"]) =>
  loggedManagers.delete(getClientId(socket))

export const emitConfig = (socket: SocketContext["socket"]) =>
  socket.emit(EVENTS.MANAGER.CONFIG, { quizz: Config.quizzMeta() })

export const withAuth =
  <T extends unknown[]>(
    socket: SocketContext["socket"],
    handler: (..._args: T) => void,
  ) =>
  (..._args: T) => {
    if (!isLogged(socket)) {
      socket.emit(EVENTS.MANAGER.UNAUTHORIZED)

      return
    }

    handler(..._args)
  }
