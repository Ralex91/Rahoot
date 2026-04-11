import { EVENTS } from "@rahoot/common/constants"
import type { SocketContext } from "@rahoot/socket/handlers/types"
import Config from "@rahoot/socket/services/config"
import { emitConfig, withAuth } from "@rahoot/socket/services/manager"

export const quizzSocketHandlers = ({ socket }: SocketContext) => {
  socket.on(
    EVENTS.QUIZZ.GET,
    withAuth(socket, (id) => {
      try {
        const quizz = Config.quizzById(id)

        socket.emit(EVENTS.QUIZZ.DATA, quizz)
      } catch (error) {
        console.error("Failed to get quizz:", error)
        socket.emit(
          EVENTS.QUIZZ.ERROR,
          error instanceof Error ? error.message : "Quizz not found",
        )
      }
    }),
  )

  socket.on(
    EVENTS.QUIZZ.SAVE,
    withAuth(socket, (data) => {
      try {
        const { id } = Config.saveQuizz(data)

        socket.emit(EVENTS.QUIZZ.SAVE_SUCCESS, { id })
        emitConfig(socket)
      } catch (error) {
        console.error("Failed to save quizz:", error)
        socket.emit(
          EVENTS.QUIZZ.ERROR,
          error instanceof Error ? error.message : "Failed to save quizz",
        )
      }
    }),
  )

  socket.on(
    EVENTS.QUIZZ.UPDATE,
    withAuth(socket, ({ id, ...data }) => {
      try {
        const { id: newId } = Config.updateQuizz(id, data)

        socket.emit(EVENTS.QUIZZ.UPDATE_SUCCESS, { id: newId })
        emitConfig(socket)
      } catch (error) {
        console.error("Failed to update quizz:", error)
        socket.emit(
          EVENTS.QUIZZ.ERROR,
          error instanceof Error ? error.message : "Failed to update quizz",
        )
      }
    }),
  )
}
