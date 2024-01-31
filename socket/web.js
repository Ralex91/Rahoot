import { Server } from "socket.io"

const io = new Server({
  cors: {
    origin: "*",
  },
})

io.on("connection", (socket) => {
  console.log("a user connected")
  io.to(socket.id).emit("message", "Hello from server")
})

io.listen(5057)
