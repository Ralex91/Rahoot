import type { Server, Socket } from "@rahoot/common/types/game/socket"

export type SocketContext = {
  io: Server
  socket: Socket
}

export type SocketHandler = (_context: SocketContext) => void
