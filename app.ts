import dotenv from "dotenv";
import express from "express";
import http from "http";
import socketio from "socket.io";

dotenv.config({ path: ".env" });
const app: express.Application = express();
const httpServer: http.Server = new http.Server(app);
const io: socketio.Server = socketio(httpServer);

export { httpServer, io };
