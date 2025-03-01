import express from "express";
import { createServer } from "http";
import routes from "./routes";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./helpers/logger";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
app.use("", routes);

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
