// src/types/index.d.ts

export {}; // Necesario para que sea un módulo global

/**
 * Tipos globales del microservicio FNFO-GameService.
 */
declare global {
  /**
   * Los cuatro únicos juicios válidos del juego.
   */
  type Judgment = "perfect" | "great" | "good" | "miss";

  /**
   * Estadísticas del jugador al finalizar el match.
   */
  interface FNFOPlayerStats {
    userId: string;
    score: number;
    perfect: number;
    great: number;
    good: number;
    miss: number;
    comboMax?: number;
    accuracy?: number;
    latency?: number;
  }

  /**
   * Resultado final de un match.
   */
  interface FNFOMatchResult {
    matchId: string;
    songId: string;
    difficulty: string;
    endedAt: Date;
    players: FNFOPlayerStats[];
  }
}

/**
 * Extensión del tipo Socket de socket.io
 */
declare module "socket.io" {
  interface Socket {
    userId?: string;
    matchId?: string;
    latency?: number;
  }
}

/**
 * Tipado fuerte de variables de entorno
 */
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    REDIS_URL: string;
    WS_ALLOW_ORIGINS: string;

    CONTENT_BASE_URL: string;
    STATISTICS_BASE_URL: string;
    LEADERBOARD_BASE_URL: string;

    MATCH_TTL_SEC: string;
    INPUT_RATE_MAX: string;
  }
}
