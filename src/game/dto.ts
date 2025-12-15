/* ===================== */
/* MATCH STATE           */
/* ===================== */

/**
 * Estados posibles de una partida
 * (controlados por GameService)
 */
export type MatchState =
  | "waiting"
  | "playing"
  | "finished"
  | "player_disconnected";

/* ===================== */
/* MATCH CONFIG          */
/* ===================== */

export interface MatchConfig {
  matchId: string;
  songId: string;
  difficulty: string;
  players: string[]; // userIds
  startTime?: number;
}

/* ===================== */
/* LIVE SNAPSHOT (WS)    */
/* ===================== */

/**
 * Snapshot enviado periódicamente por el frontend
 * (score en vivo, NO inputs)
 */
export interface LiveSnapshot {
  score: number;
  combo: number;
  accuracy: number;
  progress: number; // 0.0 → 1.0
}

/* ===================== */
/* CLIENT → SERVER EVENTS */
/* ===================== */

export interface ClientReadyPayload {
  matchId: string;
  userId: string;
}

export interface ClientSnapshotPayload {
  matchId: string;
  userId: string;
  snapshot: LiveSnapshot;
}

/**
 * Resultado FINAL calculado en frontend
 */
export interface FinalResultSummary {
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

  /**
   * Datos necesarios para otros servicios
   */
  firebaseUid: string;
  gameMode: string;

  /**
   * ID Token Firebase del usuario
   * (se reenvía a StatisticsService)
   */
  token: string;
}

export interface ClientFinishPayload {
  matchId: string;
  userId: string;
  result: FinalResultSummary;
}

/* ===================== */
/* INTERNAL / REDIS      */
/* ===================== */

/**
 * Resultados finales del match
 * Guardados temporalmente en Redis
 * Key = userId
 */
export type MatchResultsMap = Record<string, FinalResultSummary>;
