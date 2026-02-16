import { Server } from "socket.io";
import { verifyTokenAndReturnEmail } from "./jwt.js";
import { getUserByEmail } from "./auth.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error ("No token");
  
      const email = await verifyTokenAndReturnEmail(token);
      const user = await getUserByEmail(email);
  
      socket.user = user;
      socket.join(user.id.toString());
      
      next();
    } catch (err) {
      next(new Error("Unauthorized"))
    }
  })

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
