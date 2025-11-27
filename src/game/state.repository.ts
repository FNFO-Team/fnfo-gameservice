// src/game/state.repository.ts
import { redis } from "../config/redis";
import { env } from "../config/env";

export class StateRepository {
  /**
   * Guarda estado general de un match
   */
  async saveMatchState(matchId: string, data: any): Promise<void> {
    await redis.set(
      `match:${matchId}:state`,
      JSON.stringify(data),
      "EX",
      env.MATCH_TTL_SEC
    );
  }

  /**
   * Obtiene estado general
   */
  async getMatchState(matchId: string): Promise<any> {
    const res = await redis.get(`match:${matchId}:state`);
    return res ? JSON.parse(res) : null;
  }

  /**
   * Actualiza puntaje individual
   */
  async updatePlayerScore(matchId: string, userId: string, score: number): Promise<void> {
    await redis.hset(`match:${matchId}:scores`, userId, String(score));
    await redis.expire(`match:${matchId}:scores`, env.MATCH_TTL_SEC);
  }

  /**
   * Obtiene todos los puntajes del match
   */
  async getMatchScores(matchId: string): Promise<Record<string, number>> {
    const scores = await redis.hgetall(`match:${matchId}:scores`);
    const numericScores: Record<string, number> = {};

    for (const [userId, scoreStr] of Object.entries(scores)) {
      numericScores[userId] = Number(scoreStr);
    }

    return numericScores;
  }

  /**
   * Elimina todo el estado (cleanup final del match)
   */
  async deleteMatchState(matchId: string): Promise<void> {
    await redis.del(
      `match:${matchId}:state`,
      `match:${matchId}:scores`
    );
  }
}
