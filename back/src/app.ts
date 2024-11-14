import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db";
import userRoutes from "./routes/userRoutes";
import { createServer } from "http";
import { initializeSocketServer } from "./socketServer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDb();

// Middleware
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);

const io = initializeSocketServer(httpServer);

// Routes
app.use("/api", userRoutes);

// Error handling middleware

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
