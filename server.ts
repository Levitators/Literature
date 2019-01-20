import {httpServer} from "./app";
import logger from "./utils/logger";

const port: string = process.env.PORT || "3000";
httpServer.listen(port, () => {
  logger.info(`Server started at port ${port}`);
});
