import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import organizations from "./models/organization";

export function initializeSocketServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

    socket.on("join", (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on("leave", (room) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
    });

    socket.on("sendAttack", (room, attack) => {
      io.to(room).emit("sendAttack", attack);
    });

    socket.on("updateMissile", async (missile) => {
      const existOrganization = await organizations.findOne({ name: missile.organization });
      if (existOrganization) {
        existOrganization.resources.forEach((resource) => {
          if (resource.name === missile.name && resource.amount > 0) {
            resource.amount--;
          }
        });
        await existOrganization.save();
        io.emit("updateMissile", missile);
      } else {
        console.error("Organization not found:", missile.organization);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected: ", socket.id, "reason: ", reason);
    });
  });
}
