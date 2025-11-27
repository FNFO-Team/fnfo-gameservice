// src/integrations/leaderboard.client.ts
import { httpClient } from "../common/httpClient";
import { env } from "../config/env";
import { MatchResult } from "../game/dto";

export class LeaderboardClient {
  /**
   * Actualiza el leaderboard global al finalizar una partida.
   */
  async postLeaderboardEntry(result: MatchResult): Promise<void> {
    const url = `${env.LEADERBOARD_BASE_URL}/leaderboard`;

    const response = await httpClient.post(url, result, {
      headers: {
        "Idempotency-Key": result.matchId,
      },
    });

    if (response.status >= 400) {
      console.error("Error al actualizar leaderboard:", response.data);
      throw new Error("LeaderboardService no aceptó los datos");
    }

    console.log("Leaderboard actualizado");
  }
}
