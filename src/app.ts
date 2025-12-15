import express from "express";
import cors from "cors";
import gameRoutes from "./game/game.routes";
import { errorHandler } from "./common/errorHandler";

export function createApp() {
  const app = express();

  // Middlewares básicos
  app.use(cors());
  app.use(express.json());

  // Rutas
  app.use("/", gameRoutes);

  // Error handler (siempre al final)
  app.use(errorHandler);

  return app;
}
