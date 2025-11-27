// src/game/game.controller.ts
import { Request, Response } from "express";
import { MatchService } from "./match.service";

export class GameController {
  private matchService = new MatchService();

  /**
   * GET /api/game/health
   */
  healthCheck(_req: Request, res: Response) {
    res.json({ status: "ok", service: "FNFO GameService" });
  }

  /**
   * POST /api/game/start
   * -> Llamado por MatchmakingService
   * body: { matchId, players, songId, difficulty, bpm }
   */
  async startMatch(req: Request, res: Response) {
    try {
      await this.matchService.initMatch(req.body);
      res.status(200).json({ message: "Match initialized" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * POST /api/game/end
   */
  async endMatch(req: Request, res: Response) {
    try {
      const { matchId } = req.body;
      const result = await this.matchService.finalizeMatch(matchId);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /**
   * GET /api/game/match/:id
   */
  async getMatchById(req: Request, res: Response) {
    try {
      const result = await this.matchService.getMatchResult(req.params.id);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(404).json({ error: "Match not found" });
    }
  }
}
