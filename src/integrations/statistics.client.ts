// src/integrations/statistics.client.ts
import { httpClient } from "../common/httpClient";
import { env } from "../config/env";
import { MatchResult } from "../game/dto";

export class StatisticsClient {
  /**
   * Envía a StatisticsService los datos de rendimiento de una partida.
   */
  async postMatchStatistics(result: MatchResult): Promise<void> {
    const url = `${env.STATISTICS_BASE_URL}/matches`;

    const response = await httpClient.post(url, result, {
      headers: {
        "Idempotency-Key": result.matchId,
      },
    });

    if (response.status >= 400) {
      console.error("Error al enviar estadísticas:", response.data);
      throw new Error("StatisticsService no procesó los datos");
    }

    console.log("Estadísticas enviadas correctamente");
  }
}
