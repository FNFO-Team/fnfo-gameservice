import { Router } from "express";
import { GameController } from "./game.controller";
import { MatchService } from "./match.service";
import { StateRepository } from "./state.repository";

const router = Router();

// Dependencias
const stateRepository = new StateRepository();
const matchService = new MatchService(stateRepository);
const gameController = new GameController(matchService);

// Health
router.get("/health", (req, res) => gameController.health(req, res));

// Match lifecycle
router.post("/game/start", (req, res, next) =>
  gameController.startMatch(req, res, next)
);

router.get("/game/:matchId", (req, res, next) =>
  gameController.getMatch(req, res, next)
);

router.post("/game/end", (req, res, next) =>
  gameController.endMatch(req, res, next)
);

export default router;
