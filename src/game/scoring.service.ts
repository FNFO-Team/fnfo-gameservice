// src/game/scoring.service.ts

type Judgment = "perfect" | "great" | "good" | "miss";

export class ScoringService {
  /**
   * Evalúa qué tan cerca estuvo el hit del tiempo exacto
   */
  calculateHitAccuracy(hitTime: number, expectedTime: number): Judgment {
    const diff = Math.abs(hitTime - expectedTime);

    if (diff <= 30) return "perfect";
    if (diff <= 70) return "great";
    if (diff <= 120) return "good";
    return "miss";
  }

  /**
   * Actualiza puntaje del jugador
   */
  updatePlayerStats(
    userId: string,
    judgment: Judgment,
    currentScore: number
  ): number {
    const scores: Record<Judgment, number> = {
      perfect: 1000,
      great: 500,
      good: 200,
      miss: 0,
    };

    return currentScore + scores[judgment];
  }
}
