import { Socket } from "socket.io";
import { io } from "./app";
import logger from "./utils/logger";

io.on("connection", (socket: Socket) => {
  logger.log("a user connected", socket.id);
});
