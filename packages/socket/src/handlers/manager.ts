import { EVENTS } from "@rahoot/common/constants"
import type { SocketContext } from "@rahoot/socket/handlers/types"
import Config from "@rahoot/socket/services/config"
import {
  emitConfig,
  login,
  logout,
  withAuth,
} from "@rahoot/socket/services/manager"

export const managerSocketHandlers = ({ socket }: SocketContext) => {
  socket.on(
    EVENTS.MANAGER.GET_CONFIG,
    withAuth(socket, () => {
      emitConfig(socket)
    }),
  )

  socket.on(EVENTS.MANAGER.LOGOUT, () => {
    logout(socket)
  })

  socket.on(EVENTS.MANAGER.AUTH, (password) => {
    try {
      const config = Config.game()

      if (config.managerPassword === "PASSWORD") {
        socket.emit(
          EVENTS.MANAGER.ERROR_MESSAGE,
          "manager.passwordNotConfigured",
        )

        return
      }

      if (password !== config.managerPassword) {
        socket.emit(
          EVENTS.MANAGER.ERROR_MESSAGE,
          "errors:manager.invalidPassword",
        )

        return
      }

      login(socket)
      emitConfig(socket)
    } catch (error) {
      console.error("Failed to read game config:", error)
      socket.emit(EVENTS.MANAGER.ERROR_MESSAGE, "errors:failedToReadConfig")
    }
  })
}
