import { Server } from "socket.io"

const socketHandler = (req, res) => {
  if (!res.socket.server.io) {
    const path = "/api/socket"
    const httpServer = res.socket.server

    //const io = createIOServer(httpServer, path)
    const io = new Server(httpServer, {
      path: path,
      addTrailingSlash: false,
    })

    res.socket.server.io = io
    console.log("SocketIO server started at " + path)
  }

  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default socketHandler
