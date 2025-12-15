import { httpClient } from "../common/httpClient";
import { env } from "../config/env";
import { generateIdempotencyKey } from "../utils/idempotency";

interface LeaderboardSubmitPayload {
  matchId: string;
  userId: string;
  firebaseUid: string;
  songId: string;
  gameMode: string;
  score: number;
  accuracy: number;
}

export class LeaderboardClient {
  /**
   * Envía el score final de un jugador al LeaderboardService.
   */
  async submitScore(payload: LeaderboardSubmitPayload): Promise<void> {
    const url = `${env.LEADERBOARD_BASE_URL}/submit`;

    const response = await httpClient.post(url, payload, {
      headers: {
        "Idempotency-Key": generateIdempotencyKey(
          payload.matchId + ":" + payload.userId
        ),
      },
    });

    if (!response || response.status >= 400) {
      console.error("LeaderboardService error:", response?.data);
      throw new Error("Failed to submit leaderboard score");
    }

    console.log("Leaderboard updated for user", payload.userId);
  }
}
