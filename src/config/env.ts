import dotenv from "dotenv";

dotenv.config();

/**
 * Obtiene una variable de entorno obligatoria.
 */
function requireEnv(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

/**
 * Variables de entorno del GameService (MVP).
 */
export const env = {
  PORT: Number(requireEnv("PORT", "8080")),

  REDIS_URL: requireEnv("REDIS_URL"),

  /**
   * Orígenes permitidos para WebSocket (CORS).
   * Ejemplo: http://localhost:5173,http://localhost:3000
   */
  WS_ALLOW_ORIGINS: requireEnv("WS_ALLOW_ORIGINS", "*")
    .split(",")
    .map((o) => o.trim()),

  /**
   * Integraciones externas (solo al finalizar el match)
   */
  STATISTICS_BASE_URL: requireEnv("STATISTICS_BASE_URL"),
  LEADERBOARD_BASE_URL: requireEnv("LEADERBOARD_BASE_URL"),

  /**
   * Tiempo de vida de una partida en Redis (segundos)
   */
  MATCH_TTL_SEC: Number(requireEnv("MATCH_TTL_SEC", "900")),
};
