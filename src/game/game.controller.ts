import { Request, Response, NextFunction } from "express";
import { MatchService } from "./match.service";
import { MatchConfig } from "./dto";

export class GameController {
  constructor(private readonly matchService: MatchService) {}

  /**
   * Health check simple.
   */
  health(req: Request, res: Response) {
    res.json({ status: "ok" });
  }

  /**
   * Inicia un match (llamado por Matchmaking).
   */
  async startMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const config: MatchConfig = req.body;

      if (!config?.matchId || !config?.players?.length) {
        return res.status(400).json({ error: "Invalid match config" });
      }

      await this.matchService.initMatch(config);

      res.status(201).json({
        message: "Match created",
        matchId: config.matchId,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene información básica del match.
   */
  async getMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { matchId } = req.params;

      const match = await this.matchService.getMatch(matchId);

      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      res.json(match);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Finaliza un match de forma forzada (fallback).
   */
  async endMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { matchId } = req.body;

      if (!matchId) {
        return res.status(400).json({ error: "matchId is required" });
      }

      await this.matchService.forceEndMatch(matchId);

      res.json({ message: "Match ended" });
    } catch (error) {
      next(error);
    }
  }
}
