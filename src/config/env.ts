// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

/**
 * Validación helper
 */
function requireEnv(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

/**
 * Env global del microservicio
 */
export const env = {
  PORT: Number(requireEnv("PORT", "8080")),
  REDIS_URL: requireEnv("REDIS_URL"),
  WS_ALLOW_ORIGINS: requireEnv("WS_ALLOW_ORIGINS", "*")
    .split(",")
    .map((o) => o.trim()),

  // Integraciones externas
  CONTENT_BASE_URL: requireEnv("CONTENT_BASE_URL"),
  STATISTICS_BASE_URL: requireEnv("STATISTICS_BASE_URL"),
  LEADERBOARD_BASE_URL: requireEnv("LEADERBOARD_BASE_URL"),

  // Opciones internas
  MATCH_TTL_SEC: Number(requireEnv("MATCH_TTL_SEC", "900")),
  INPUT_RATE_MAX: Number(requireEnv("INPUT_RATE_MAX", "120")),
};
