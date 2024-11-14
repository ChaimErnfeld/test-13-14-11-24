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

    socket.on("sendAttack", async (attack) => {
      io.emit("sendAttack", attack);
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
