// src/integrations/content.client.ts
import { httpClient } from "../common/httpClient";
import { env } from "../config/env";

export class ContentClient {
  /**
   * Pide al ContentService las URLs de la canción y el chart.
   */
  async getSongAndChart(
    songId: string,
    difficulty: string
  ): Promise<{ songUrl: string; chartUrl: string }> {
    const url = `${env.CONTENT_BASE_URL}/songs/${songId}?difficulty=${difficulty}`;

    const response = await httpClient.get(url);

    if (!response || response.status !== 200) {
      throw new Error(
        `ContentService error (${response?.status}): No se pudieron obtener recursos del juego`
      );
    }

    const { songUrl, chartUrl } = response.data;

    if (!songUrl || !chartUrl) {
      throw new Error("ContentService devolvió datos incompletos");
    }

    return { songUrl, chartUrl };
  }
}
