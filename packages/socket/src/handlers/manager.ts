import { EVENTS } from "@rahoot/common/constants"
import type { SocketContext } from "@rahoot/socket/handlers/types"
import Config from "@rahoot/socket/services/config"

const loggedManager = new Set<string>()

export const managerSocketHandlers = ({ socket }: SocketContext) => {
  socket.on(EVENTS.MANAGER.AUTH, (password) => {
    try {
      const config = Config.game()

      if (config.managerPassword === "PASSWORD") {
        socket.emit(
          EVENTS.MANAGER.ERROR_MESSAGE,
          "Manager password is not configured",
        )

        return
      }

      if (password !== config.managerPassword) {
        socket.emit(EVENTS.MANAGER.ERROR_MESSAGE, "Invalid password")

        return
      }

      loggedManager.add(socket.id)
      socket.emit(EVENTS.MANAGER.CONFIG, {
        quizz: Config.quizz(),
      })
    } catch (error) {
      console.error("Failed to read game config:", error)
      socket.emit(EVENTS.MANAGER.ERROR_MESSAGE, "Failed to read game config")
    }
  })

  socket.on("disconnect", () => {
    loggedManager.delete(socket.id)
  })
}
