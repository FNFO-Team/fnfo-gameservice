import { httpClient } from "../common/httpClient";
import { env } from "../config/env";
import { generateIdempotencyKey } from "../utils/idempotency";

interface StatisticsGameResultPayload {
  songId: string;
  score: number;
  accuracy: number;
  maxCombo: number;
  durationMs: number;
  hits: {
    perfect: number;
    great: number;
    good: number;
    miss: number;
  };
}

export class StatisticsClient {
  /**
   * Envía el resultado final de una partida al StatisticsService.
   * Reenvía el token del usuario para que authMiddleware resuelva el userId.
   */
  async postGameResult(
    payload: StatisticsGameResultPayload,
    userToken: string,
    matchId: string
  ): Promise<void> {
    const url = `${env.STATISTICS_BASE_URL}/stats/game-result`;

    const response = await httpClient.post(url, payload, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Idempotency-Key": generateIdempotencyKey(matchId),
      },
    });

    if (!response || response.status >= 400) {
      console.error("StatisticsService error:", response?.data);
      throw new Error("Failed to send game result to statistics");
    }

    console.log("Statistics updated");
  }
}
