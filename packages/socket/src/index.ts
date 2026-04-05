import type { Server } from "@rahoot/common/types/game/socket"
import { gameSocketHandlers } from "@rahoot/socket/handlers/game"
import { managerSocketHandlers } from "@rahoot/socket/handlers/manager"
import type { SocketHandler } from "@rahoot/socket/handlers/types"
import Config from "@rahoot/socket/services/config"
import Registry from "@rahoot/socket/services/registry"
import { Server as ServerIO } from "socket.io"

const WS_PORT = 3001

const io: Server = new ServerIO({
  path: "/ws",
})
Config.init()

console.log(`Socket server running on port ${WS_PORT}`)
io.listen(WS_PORT)

const socketHandlers: SocketHandler[] = [
  managerSocketHandlers,
  gameSocketHandlers,
]

io.on("connection", (socket) => {
  console.log(
    `A user connected: socketId: ${socket.id}, clientId: ${socket.handshake.auth.clientId}`,
  )

  socketHandlers.forEach((handler) => {
    handler({ io, socket })
  })
})

process.on("SIGINT", () => {
  Registry.getInstance().cleanup()
  process.exit(0)
})

process.on("SIGTERM", () => {
  Registry.getInstance().cleanup()
  process.exit(0)
})
