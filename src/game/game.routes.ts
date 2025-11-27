// src/game/game.routes.ts
import { Router } from "express";
import { GameController } from "./game.controller";

export const gameRouter = Router();
const controller = new GameController();

/**
 * Health Check
 */
gameRouter.get("/health", controller.healthCheck.bind(controller));

/**
 * Iniciar partida (llamado por MatchmakingService)
 */
gameRouter.post("/start", controller.startMatch.bind(controller));

/**
 * Finalizar partida manualmente (opcional)
 */
gameRouter.post("/end", controller.endMatch.bind(controller));

/**
 * Consultar resultados de una partida (opcional)
 */
gameRouter.get("/match/:id", controller.getMatchById.bind(controller));
